import {FastifyInstance, FastifyRequest} from "fastify";
import { prisma } from "./prisma";
import { z } from 'zod';
import dayjs from 'dayjs';

interface SummaryResponse {
  date: string;
  amount: number;
  completed: number;
}

export async function appRoutes(app: FastifyInstance){

  app.post("/habits",async (request) => {
    const createHabitBody = z.object({
      title: z.string(),
      weekDays: z.array(z.number().min(0).max(6))
    });

    const { title, weekDays } = createHabitBody.parse(request.body);
    
    //zera a hora na criação da data.
    const today = dayjs().startOf('day').toDate();

    await prisma.habit.create({
      data: {
        title,
        created_at: today,
        week_days: { //criação relacional
          create: weekDays.map(weekDay => ({ 
            week_day: weekDay 
          }))
        }
      }
    });
  });

  app.get('/day',async (request) => {
    const getDayParams = z.object({
      date: z.coerce.date() //converte o parametro string em data.
    })

    const { date } = getDayParams.parse(request.query);

    const parseDate = dayjs(date).startOf('day');
    
    const weekDay = parseDate.get('day');

    const possibleHabits = await prisma.habit.findMany({
      where: {
        created_at: {
          lte: date
        },
        week_days: {
          some: {
            week_day: weekDay
          }
        }
      }
    });

    const day = await prisma.day.findUnique({
      where: {
        date: parseDate.toDate()
      },
      include: {
        day_habit: true
      }
    });

    const completedHabits = day?.day_habit.map(dayHabit=>{
      return dayHabit.habit_id;
    });

    return { possibleHabits, completedHabits };
  });
  
  //completar / não-completar um habito
  app.patch('/habits/:id/toggle', async(request)=>{
    const toggleHabitParams = z.object({
      id: z.string().uuid()
    });

    const { id } = toggleHabitParams.parse(request.params);

    const today = dayjs().startOf('day').toDate();
    
    let day = await prisma.day.findUnique({
      where: {
        date: today,
      }
    });

    if(!day){
      day = await prisma.day.create({
        data: {
          date: today
        }
      });
    }

    const dayHabit = await prisma.dayHabit.findUnique({
      where: {
        day_id_habit_id: {
          day_id: day.id,
          habit_id: id
        }
      }
    });

    if(dayHabit){
      await prisma.dayHabit.delete({
        where: {
          id: dayHabit.id,
        }
      });
    }else{
      //completar o habito
      await prisma.dayHabit.create({
        data: {
          day_id: day.id,
          habit_id: id,
        }
      });
    }
    

  });

  app.get('/summary', async (request: FastifyRequest) => {
    const summary = await prisma.$queryRaw`
      SELECT 
        D.id, 
        D.date,
        (
          SELECT
            cast(count(*) as float)
          FROM day_habits DH
          WHERE DH.day_id = D.id
        ) as completed,
        (
          SELECT
            cast(count(*) as float)
          FROM habit_week_days HWD
          JOIN habits H
            ON H.id = HWD.habit_id
          WHERE
            HWD.week_day = cast(strftime('%w',D.date/1000.0, 'unixepoch') as int)
            AND H.created_at <= D.date
        ) as amount
      FROM days D;
    `;

    return summary;
  });
}