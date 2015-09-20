# -*- mode: ruby -*-
# vi: set ft=ruby :

# ip_address = '192.168.33.13'
project_name = 'mondedie-chat'

Vagrant.configure(2) do |config|

  config.vm.box = 'ubuntu/trusty64'
  config.vm.box_url = 'ubuntu/trusty64'
  config.vm.network "forwarded_port", guest: 5000, host: 5000
  config.vm.synced_folder './share', '/home/vagrant/share', :mount_options => ['dmode=777', 'fmode=666']

  config.vm.provider 'virtualbox' do |vb|
    vb.gui = false
    vb.memory = '2048'
  end

  config.berkshelf.enabled = true

  config.vm.hostname = project_name + '.local'
  # config.vm.network :private_network, ip: ip_address

  config.vm.provision :chef_solo do |chef|

    chef.add_recipe 'apt'
    chef.add_recipe 'build-essential'
    chef.add_recipe 'redisio'
    chef.add_recipe 'redisio::enable'
    chef.add_recipe 'chat::packages'
    chef.add_recipe 'chat::nodejs'
    chef.add_recipe 'chat::setup'

    chef.json = {
      :chat => {
        :packages => %W{ vim git curl },
        :npm_packages => %W{ bower grunt-cli nodemon }
      }
    }
  end
end