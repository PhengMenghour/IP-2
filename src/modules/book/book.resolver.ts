import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";

@Resolver("Booking")
export class BookResolver {
  private bookings = [
    {
      id: 1,
      start_date: new Date("2025-06-10T00:00:00Z"),
      end_date: new Date("2025-06-12T00:00:00Z"),
      hotel_id: 1,
      is_checked_in: false,
      price: 100,
    },
    {
      id: 2,
      start_date: new Date("2025-06-15T00:00:00Z"),
      end_date: new Date("2025-06-17T00:00:00Z"),
      hotel_id: 2,
      is_checked_in: true,
      price: 150,
    },
  ];

  @Query("bookings")
  getAllBookings() {
    return this.bookings.map((b) => ({
      ...b,
      start_date: b.start_date ? b.start_date.toISOString() : null,
      end_date: b.end_date ? b.end_date.toISOString() : null,
    }));
  }
  @Query("booking")
  getBookingById(@Args("id") id: number) {
    return this.bookings.find((b) => b.id === id);
  }

  @Query("bookingsByDateRange")
  getBookingsByDateRange(@Args("start") start: Date, @Args("end") end: Date) {
    return this.bookings.filter(
      (b) =>
        new Date(b.start_date) >= new Date(start) &&
        new Date(b.end_date) <= new Date(end),
    );
  }

  @Mutation("bookHotel")
  bookHotel(
    @Args("start_date") start_date: Date,
    @Args("end_date") end_date: Date,
    @Args("hotel_id") hotel_id: number,
    @Args("price") price: number,
  ) {
    const newId =
      this.bookings.length > 0
        ? Math.max(...this.bookings.map((b) => b.id)) + 1
        : 1;
    const newBooking = {
      id: newId,
      start_date: new Date(start_date),
      end_date: new Date(end_date),
      hotel_id,
      is_checked_in: false,
      price,
    };
    this.bookings.push(newBooking);
    return newBooking;
  }

  @Mutation("cancelBooking")
  cancelBooking(@Args("id") id: number) {
    const index = this.bookings.findIndex((b) => b.id === id);
    if (index === -1) return false;
    this.bookings.splice(index, 1);
    return true;
  }

  @Mutation("checkInBooking")
  checkInBooking(@Args("id") id: number) {
    const booking = this.bookings.find((b) => b.id === id);
    if (!booking) throw new Error("Booking not found");
    booking.is_checked_in = true;
    return booking;
  }
}