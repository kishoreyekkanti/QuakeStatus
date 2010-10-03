require 'rubygems'
  require 'sinatra'
require 'net/http'
require "crack"
require "json"
require 'xmlsimple'

get "/earthquakes" do
#myXML  = Crack::XML.parse(Net::HTTP.get_response(URI.parse('http://earthquakes.usgs.gov/earthquakes/catalogs/1day-M2.5.xml')).body)
  hash  = XmlSimple.xml_in(Net::HTTP.get_response(URI.parse('http://earthquakes.usgs.gov/earthquakes/catalogs/1day-M2.5.xml')).body)
#  p hash["entry"][0]["elev"]
#  p JSON.generate [1, 2, {"a"=>3.141}, false, true, nil, 4..10]
 hash.to_json
#myJSON = myXML.to_json
end




