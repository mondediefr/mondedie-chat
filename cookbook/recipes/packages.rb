include_recipe 'apt'

node['chat']['packages'].each do |a_package|
  package a_package
end