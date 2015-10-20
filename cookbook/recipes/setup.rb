template '/home/vagrant/mondedie-chat/.env' do
  source 'env'
end

script 'chat' do
  interpreter 'bash'
  cwd '/home/vagrant'
  code <<-EOH
    su vagrant -l -c 'bash /home/vagrant/mondedie-chat/script/install.sh'
  EOH
end
