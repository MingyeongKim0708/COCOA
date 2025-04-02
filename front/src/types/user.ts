export enum Gender {
  female = "여성",
  male = "남성",
}

export enum AgeGroup {
  teen = "10대",
  twenties = "20대",
  thirties = "30대",
  forties = "40대",
  fifties = "50대",
  sixties = "60대 이상",
}

export enum SkinTone {
  spring_warm = "봄웜톤",
  summer_cool = "여름쿨톤",
  autumn_warm = "가을웜톤",
  winter_cool = "겨울쿨톤",
  unknown = "톤모름",
}

export enum SkinType {
  dry = "건성",
  normal = "중성",
  oily = "지성",
  combination = "복합성",
  dehydratedOily = "수부지",
}

export interface User {
  id: number;
  nickname: string;
  imageUrl: string;
  ageGroup: AgeGroup;
  gender: Gender;
  skinType: SkinType;
  skinTone: SkinTone;
}
