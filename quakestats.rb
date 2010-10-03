require 'rubygems'
  require 'sinatra'
require 'net/http'
require "crack"

get "/earthquakes" do
myXML  = Crack::XML.parse(Net::HTTP.get_response(URI.parse('http://earthquakes.usgs.gov/earthquakes/catalogs/1day-M2.5.xml')).body)
myJSON = myXML.to_json
end


