import type { EventHandler, EventHandlerRequest, H3Event } from 'h3'
import type { ApiKey, Session } from '@prisma/client'
import { useForbiddenError, useUnauthorizedError } from '~~/server/utils/errors'

export interface CustomH3Event extends H3Event {
  context: {
    session: Session | null
    apiKey: ApiKey | null
  }
}

export interface UnauthenticatedH3Event extends CustomH3Event {
  context: {
    session: null
    apiKey: null
  }
}

export interface SessionAuthenticatedH3Event extends CustomH3Event {
  context: {
    session: Session
    apiKey: ApiKey | null
  }
}

export interface ApiKeyAuthenticatedH3Event extends CustomH3Event {
  context: {
    session: Session | null
    apiKey: ApiKey
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type CustomEventHandler<T extends EventHandlerRequest, D> = (event: CustomH3Event) => D | Promise<D>

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type UnauthenticatedEventHandler<T extends EventHandlerRequest, D> = (event: UnauthenticatedH3Event) => D | Promise<D>

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type SessionAuthenticatedEventHandler<T extends EventHandlerRequest, D> = (event: SessionAuthenticatedH3Event) => D | Promise<D>

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type ApiKeyAuthenticatedEventHandler<T extends EventHandlerRequest, D> = (event: ApiKeyAuthenticatedH3Event) => D | Promise<D>

export const defineCustomEventHandler = <T extends EventHandlerRequest, D> (handler: CustomEventHandler<T, D>): EventHandler<T, D> =>
  defineEventHandler<T>((event) => {
    return handler(event as CustomH3Event)
  })

export const defineUnauthenticatedEventHandler = <T extends EventHandlerRequest, D> (handler: UnauthenticatedEventHandler<T, D>): EventHandler<T, D> =>
  defineCustomEventHandler<T, D>((event) => {
    if (event.context.session) {
      throw useForbiddenError()
    }
    return handler(event as UnauthenticatedH3Event)
  })

export const defineSessionAuthenticatedEventHandler = <T extends EventHandlerRequest, D> (handler: SessionAuthenticatedEventHandler<T, D>): EventHandler<T, D> =>
  defineCustomEventHandler<T, D>((event) => {
    if (!event.context.session) {
      throw useUnauthorizedError()
    }
    return handler(event as SessionAuthenticatedH3Event)
  })

export const defineApiKeyAuthenticatedEventHandler = <T extends EventHandlerRequest, D> (handler: ApiKeyAuthenticatedEventHandler<T, D>): EventHandler<T, D> =>
  defineCustomEventHandler<T, D>((event) => {
    if (!event.context.apiKey) {
      throw useUnauthorizedError()
    }
    return handler(event as ApiKeyAuthenticatedH3Event)
  })
