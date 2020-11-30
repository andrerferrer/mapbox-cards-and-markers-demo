class RestaurantsController < ApplicationController
  def index
    @restaurants = Restaurant.geocoded
    @markers = @restaurants.map do |restaurant|
      {
        lat: restaurant.latitude,
        lng: restaurant.longitude,
        popUp: render_to_string(partial: "restaurants/partials/pop_up", locals: { restaurant: restaurant }),
        id: restaurant.id
      }
    end
  end

  def show
    set_restaurant
    @review = Review.new
  end

  def new
    @restaurant = Restaurant.new
  end

  def create
    @restaurant = Restaurant.new strong_params
    @restaurant.save ? redirect_to(@restaurant) : render(:new)
  end

  def destroy
    set_restaurant
    @restaurant.destroy
  end

  private

  def set_restaurant
    @restaurant = Restaurant.find(params[:id])
  end

  def strong_params
    params.require(:restaurant).permit(Restaurant::STRONG_PARAMS)
  end
end
