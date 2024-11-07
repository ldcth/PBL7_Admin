import { ILink } from "./link.types";

export interface IDashboard {
  contents?: {
    feedback: number;
    no_feedback: number;
    type_feedback: number[];
  };
  users?: {
    total?: number;
    growth?: boolean;
    value?: string;
  };
  links?: {
    total?: number;
    growth?: boolean;
    value?: string;
    per_months: number[];
    data: ILink[];
  };
  answers?: {
    total?: number;
    growth?: boolean;
    value?: string;
    per_months: number[];
  };
  pending?: {
    total?: number;
  };
}
