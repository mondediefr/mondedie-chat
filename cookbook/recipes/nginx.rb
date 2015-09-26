include_recipe "nginx"

template '/etc/nginx/sites-available/mondedie-chat' do
  source 'nginx/mondedie-chat'
end

nginx_site 'mondedie-chat' do
  enable true
  notifies :restart, 'service[nginx]'
end
