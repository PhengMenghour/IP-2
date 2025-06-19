import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";

@Resolver("Hotel")
export class HotelResolver {
  private hotels = [
    {
      id: 1,
      name: "Royal Hotel",
      address: "123 Main Street",
      phone: "012345678",
    },
    {
      id: 2,
      name: "Sunset Resort",
      address: "456 Beach Avenue",
      phone: "098765432",
    },
    {
      id: 3,
      name: "Mountain Inn",
      address: "789 Hilltop Blvd",
      phone: "011223344",
    },
  ];

  @Query("hotels")
  getAllHotels() {
    return this.hotels;
  }

  @Query("hotel")
  getHotelById(@Args("id") id: number) {
    return this.hotels.find((hotel) => hotel.id === id);
  }

  @Mutation("createHotel")
  createHotel(
    @Args("name") name: string,
    @Args("address") address: string,
    @Args("phone") phone: string,
  ) {
    const sortedHotels = this.hotels.sort((a, b) => a.id - b.id);
    const lastId =
      sortedHotels.length > 0 ? sortedHotels[sortedHotels.length - 1].id : 0;
    const newHotel = {
      id: lastId + 1,
      name,
      address,
      phone,
    };
    this.hotels.push(newHotel);
    return newHotel;
  }

  @Mutation("updateHotel")
  updateHotel(
    @Args("id") id: number,
    @Args("name") name: string,
    @Args("address") address: string,
    @Args("phone") phone: string,
  ) {
    const index = this.hotels.findIndex((hotel) => hotel.id === id);
    if (index === -1) {
      throw new Error("Hotel not found");
    }
    const updatedHotel = {
      ...this.hotels[index],
      name,
      address,
      phone,
    };
    this.hotels[index] = updatedHotel;
    return updatedHotel;
  }

  @Mutation("deleteHotel")
  deleteHotel(@Args("id") id: number) {
    const index = this.hotels.findIndex((hotel) => hotel.id === id);
    if (index === -1) {
      return false;
    }
    this.hotels.splice(index, 1);
    return true;
  }
}