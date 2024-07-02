import { Department } from "./department";
import { EmployeeComplete } from "./employee-complete";
import { Sections } from "./sections";


export interface TrainingComplete {
    trainingId: number;
    title: string;
    description: string;
    individual: number;
    adress: string;
    deadline: string;
    trainer: number;
    trainerName: string[];
    forDepartments: number;
    forEmployees: number;
    departments: Department[];
    employees: EmployeeComplete[];
    sections: Sections[];
  }

