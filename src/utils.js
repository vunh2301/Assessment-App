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
export const inviteFormat = ({ firstname, lastname, types, gender }) => {
  var links = "";
  if (!firstname || !lastname || !types || types.length <= 0) {
    return "";
  }
  types.forEach(type => {
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
      <b>${gender ? gender : "Anh/Chị"} ${firstname} ${lastname}</b>
      thân mến:
    </p>
    <p>
      <b>Assessments 24x7</b> cảm ơn <b>${
        gender ? gender : "Anh/Chị"
      } ${lastname}</b> đã đăng ký tham gia đánh giá
      của chúng tôi.
    </p>
    <p>
      Bắt đầu làm bài đánh giá hoặc xem lại kết quả bài đánh giá <b>${
        gender ? gender : "Anh/Chị"
      } ${lastname}</b> vui
        lòng click vào liên kết bên dưới.
    </p>
    <ul>
      ${links}
    </ul>
  `;
};

export const randomInteger = max => {
  return Math.floor(Math.random() * (max + 1));
};

export const randomRgbColor = () => {
  let r = randomInteger(255);
  let g = randomInteger(255);
  let b = randomInteger(255);
  return [r, g, b];
};

export const randomHexColor = () => {
  let [r, g, b] = randomRgbColor();

  let hr = r.toString(16).padStart(2, "0");
  let hg = g.toString(16).padStart(2, "0");
  let hb = b.toString(16).padStart(2, "0");

  return "#" + hr + hg + hb;
};
