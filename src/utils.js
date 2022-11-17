import lodash from "lodash";
import deepdash from "deepdash";
import * as Realm from "realm-web";
export const {
  BSON: { ObjectId },
} = Realm;
export const _ = deepdash(lodash);

export const objectIdToString = obj => {
  return _.mapValuesDeep(obj, v => {
    if (v?._bsontype === "ObjectID") {
      v = v.toString();
    }
    return v;
  });
};

export const removeEmptyObject = obj =>
  _.filterDeep(obj, (value, key, parent) => {
    var func = _.overSome([_.isNil, _.isNaN]);
    return !func(value);
  });
