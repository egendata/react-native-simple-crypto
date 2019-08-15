require 'json'
package_json = JSON.parse(File.read('package.json'))

Pod::Spec.new do |s|
  s.name          = "react-native-simple-crypto"
  s.version       = package_json["version"]
  s.summary       = package_json["description"]
  s.authors        = package_json["contributors"]
  s.license       = package_json["license"]
  s.requires_arc  = true
  s.homepage      = package_json["homepage"]
  s.source        = { :git => "https://github.com/egendata/react-native-simple-crypto.git", :tag => "v#{package_json["version"]}" }
  s.platform      = :ios, '8.0'
  s.source_files  = "ios/**/*.{h,m}"

  s.dependency "React"
end
