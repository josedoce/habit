import {FastifyInstance} from "fastify";
import { prisma } from "./prisma";
import { z } from 'zod';
import dayjs from 'dayjs';

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
  
 

}