class Restaurant < ApplicationRecord
  STRONG_PARAMS = %i[
    name
    address
  ]
  has_many :reviews

  geocoded_by :address
  after_validation :geocode, if: :will_save_change_to_address?
end
