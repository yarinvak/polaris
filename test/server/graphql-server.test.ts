import { ApolloServer } from 'apollo-server-koa';
import { GraphQLSchema } from 'graphql';
import { applyMiddleware } from 'graphql-middleware';
import 'reflect-metadata';
import { PolarisServerConfig } from '../../src/common/injectable-interfaces';
import { PolarisMiddleware } from '../../src/middlewares/polaris-middleware';
import { createMiddleware } from '../../src/middlewares/polaris-middleware-creator';
import { PolarisGraphQLServer } from '../../src/server/graphql-server';

const apolloServerMock: { [T in keyof ApolloServer]: any } = {
    applyMiddleware: jest.fn(),
} as any;
jest.mock('apollo-server-koa', () => ({
    makeExecutableSchema: jest.fn(),
    ApolloServer: jest.fn(() => ({
        applyMiddleware: apolloServerMock.applyMiddleware,
    })),
}));
jest.mock('graphql-middleware', () => ({
    applyMiddleware: jest.fn(),
}));
jest.mock('../../src/middlewares/polaris-middleware-creator', () => ({
    createMiddleware: jest.fn(),
}));
jest.mock('../../src/schema/polaris-schema-creator', () => ({
    makeExecutablePolarisSchema: jest.fn(),
}));

describe('graphql-server tests', () => {
    const schema: { [T in keyof GraphQLSchema]: any } = {} as any;
    const polarisServerConfigMock: { [T in keyof PolarisServerConfig]: any } = {
        polarisProperties: jest.fn(),
    } as any;
    const polarisMiddlewareMock: { [T in keyof PolarisMiddleware]: any } = {} as any;

    test('creating new polaris server - with arguments - graphql apply middleware have been called', () => {
        const server = new PolarisGraphQLServer(schema, polarisServerConfigMock, [
            polarisMiddlewareMock,
        ]);

        expect(applyMiddleware).toHaveBeenCalled();
    });

    test('creating new polaris server - with arguments - create middleware have been called number of times as middlewares provided', () => {
        const middlewares = [polarisMiddlewareMock, polarisMiddlewareMock, polarisMiddlewareMock];
        const server = new PolarisGraphQLServer(schema, polarisServerConfigMock, middlewares);

        expect(createMiddleware).toHaveBeenCalledTimes(middlewares.length);
    });

    test('creating new polaris server - with arguments - apollo server constructor have been called', () => {
        const server = new PolarisGraphQLServer(schema, polarisServerConfigMock, [
            polarisMiddlewareMock,
        ]);

        expect(ApolloServer).toHaveBeenCalled();
    });

    test('creating new polaris server - with arguments - apollo server apply middleware have been called with custom path', () => {
        const polarisServerConfigMockWithEndpoint: { [T in keyof PolarisServerConfig]: any } = {
            polarisProperties: { endpoint: 'test' },
        } as any;

        const server = new PolarisGraphQLServer(schema, polarisServerConfigMockWithEndpoint, [
            polarisMiddlewareMock,
        ]);
        expect(apolloServerMock.applyMiddleware).toHaveBeenCalledWith(
            expect.objectContaining({
                path: polarisServerConfigMockWithEndpoint.polarisProperties.endpoint,
            }),
        );
    });
});
