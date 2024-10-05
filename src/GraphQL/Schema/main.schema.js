import {
  GraphQLBoolean,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from "graphql";
import { listProductResolver } from "../Resolvers/index.js";
import { productType, CouponType, CreateCouponArgs } from "../Types/index.js";
import { createCouponResolver } from "../Resolvers/index.js";

export const mainSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "rootQuery",
    description: "Root query",
    fields: {
      listProduct: {
        name: "listProduct",
        description: "description for listProduct",
        type: new GraphQLList(productType),
        resolve: listProductResolver,
      },
    },
  }),
  mutation: new GraphQLObjectType({
    name: "RootMutation",
    description: "this is root mutation",
    fields: {
      createCoupon: {
        name: "createcoupon",
        description: "create coupon",
        type: CouponType,
        args: CreateCouponArgs,
        resolve: createCouponResolver,
      },
    },
  }),
});
