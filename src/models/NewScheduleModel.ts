export type NewScheduleModel = {
  specialist_id: number;
  unit_id: number;
  duration: number;
  dates: [
    {
      date: string;
      schedules: [];
    }
  ];
};
