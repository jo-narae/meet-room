export type Room = {
  id: string;
  name: string;
  sort_order: number;
};

export type Reservation = {
  id: string;
  room_id: string;
  user_id: string;
  starts_at: string;
  ends_at: string;
  purpose: string;
};

/** 예약 + 예약자 표시 이름 */
export type ReservationWithUser = Reservation & {
  display_name: string;
};

export type Profile = {
  id: string;
  display_name: string;
  team: string | null;
};
