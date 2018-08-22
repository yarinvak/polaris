import "reflect-metadata";
import {InjectableType} from "../../../common/injectableInterfaces";
import {provide} from "inversify-binding-decorators";

@provide("InjectableType")
export default class CommonEntityInterface implements InjectableType {
    definition(): string {
        return `interface CommonEntity{
        id: ID!
        creationDate: String,
        lastUpdateDate: String,
        dataVersion: Int!}`;
    }
}