export type ResponseSchedulesModel = {
  date: string;
  schedules: [
    {
      id: number;
      start: string;
      end: string;
      duration: number;
      unit_id: number;
      unit: string;
    }
  ];
};
