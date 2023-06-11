import { request } from "../utils/axios";

export const predictBlob = async (blob) => {
  return request.post("/predict/", { image: blob }).then((res) => {
    return res;
  }).catch(err => console.log(err));
};
