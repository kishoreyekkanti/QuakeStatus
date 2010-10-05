require 'rubygems'
  require 'sinatra'
require 'net/http'
require "json"
require 'xmlsimple'

get "/earthquakes" do
  hash  = XmlSimple.xml_in(Net::HTTP.get_response(URI.parse('http://earthquake.usgs.gov/earthquakes/catalogs/1day-M2.5.xml')).body)
  marker_content = hash['entry'].collect{|h| {'latitude' => h['point'][0].split(" ")[0], 'longitude' => h['point'][0].split(" ")[1] ,
                    'content' => h['summary'][0]['content']}}

#  marker_content = hash.collect{|h| {'latitude' => h['point'][0].split(" ")[0], 'longitude' => h['point'][0].split(" ")[1] ,
#                    'content' => h['summary'][0]['content']}}
  marker_content.to_json
end




