export interface ILink {
  _id: string;
  name: string;
  new: boolean;
  questions: number | string[];
  createdAt: string;
  updatedAt: string;
}

export interface IRecord {
  _id: string;
  answers: number;
  links: string[];
  createdAt: string;
  updatedAt: string;
}

export interface IFinetuning {
  _id: string;
  answers: number;
  result: string;
  createdAt: string;
  updatedAt: string;
}
