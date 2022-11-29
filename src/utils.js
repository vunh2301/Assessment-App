import lodash from "lodash";
import deepdash from "deepdash";
import * as Realm from "realm-web";
export const {
  BSON: { ObjectId },
} = Realm;
export const _ = deepdash(lodash);

export const objectIdToString = (obj) => {
  return _.mapValuesDeep(obj, (v) => {
    if (v?._bsontype === "ObjectID") {
      v = v.toString();
    }
    return v;
  });
};

export const removeEmptyObject = (obj) =>
  _.filterDeep(obj, (value, key, parent) => {
    var func = _.overSome([_.isNil, _.isNaN]);
    return !func(value);
  });
export const inviteFormat = ({ firstname, lastname, types }) => {
  var links = "";
  if (!firstname || !lastname || !types || types.length <= 0) {
    return "";
  }
  types.forEach((type) => {
    links += `
      <li>
        <b>${type.type}: </b>
        <a href="https://link.a247.vn/${type.short}" target="_blank">
          https://link.a247.vn/${type.short}
        </a>
      </li>
      `;
  });
  return `
    <p>
      <b>${firstname} ${lastname}</b>
      thân mến:
    </p>
    <p>
      <b>Assessments 24x7</b> cảm ơn Anh/Chị đã đăng ký tham gia đánh giá
      của chúng tôi.
    </p>
    <p>
      <b>Bắt đầu làm bài đánh giá hoặc xem lại kết quả bài đánh giá Anh/Chị vui
        lòng click vào liên kết bên dưới.</b>
    </p>
    <ul>
      ${links}
    </ul>
  `;
};
