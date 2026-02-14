import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { 
  createPaymentLinkFn, 
  getPaymentFn, 
  refundPaymentFn, 
  createInvoiceFn, 
  getInvoiceFn, 
  createConsumerFn, 
  getConsumerFn 
} from '../services/streampay.server';

const t = initTRPC.create();

export const router = t.router;
export const publicProcedure = t.procedure;

export const appRouter = router({
  payment: t.router({
    createPaymentLink: publicProcedure
      .input(z.object({
        amount: z.number().positive(),
        currency: z.string().default('SAR'),
        description: z.string(),
        callbackUrl: z.string().url(),
        metadata: z.record(z.string(), z.any()).optional(),
      }))
      .mutation(async ({ input }) => {
        return createPaymentLinkFn({ data: input } as any);
      }),

    getPayment: publicProcedure
      .input(z.object({
        paymentId: z.string(),
      }))
      .query(async ({ input }) => {
        return getPaymentFn({ data: input.paymentId } as any);
      }),

    refundPayment: publicProcedure
      .input(z.object({
        paymentId: z.string(),
        amount: z.number().optional(),
        reason: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return refundPaymentFn({ data: input } as any);
      }),
  }),

  invoice: t.router({
    createInvoice: publicProcedure
      .input(z.object({
        amount: z.number().positive(),
        currency: z.string().default('SAR'),
        description: z.string(),
        items: z.array(z.object({
          name: z.string(),
          quantity: z.number().positive(),
          unitPrice: z.number().positive(),
        })).optional(),
        consumerEmail: z.string().email(),
        consumerName: z.string(),
        callbackUrl: z.string().url(),
      }))
      .mutation(async ({ input }) => {
        return createInvoiceFn({ data: input } as any);
      }),

    getInvoice: publicProcedure
      .input(z.object({
        invoiceId: z.string(),
      }))
      .query(async ({ input }) => {
        return getInvoiceFn({ data: input.invoiceId } as any);
      }),
  }),

  consumer: t.router({
    createConsumer: publicProcedure
      .input(z.object({
        name: z.string(),
        email: z.string().email(),
        phone: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return createConsumerFn({ data: input } as any);
      }),

    getConsumer: publicProcedure
      .input(z.object({
        consumerId: z.string(),
      }))
      .query(async ({ input }) => {
        return getConsumerFn({ data: input.consumerId } as any);
      }),
  }),
});

export type AppRouter = typeof appRouter;
