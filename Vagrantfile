# -*- mode: ruby -*-
# vi: set ft=ruby :

ip_address = '192.168.33.20'
project_name = 'mondedie-chat'

Vagrant.configure(2) do |config|

  config.vm.box = 'ubuntu/trusty64'
  config.vm.box_url = 'ubuntu/trusty64'
  config.vm.hostname = project_name + '.dev'
  config.vm.network :private_network, ip: ip_address
  config.vm.synced_folder '.', '/home/vagrant/mondedie-chat', :mount_options => ['dmode=777', 'fmode=666']

  config.vm.provider 'virtualbox' do |vb|
    vb.gui = false
    vb.memory = '2048'
  end

  config.berkshelf.enabled = true

  config.vm.provision :chef_solo do |chef|

    chef.add_recipe 'apt'
    chef.add_recipe 'build-essential'
    chef.add_recipe 'redisio'
    chef.add_recipe 'nginx'
    chef.add_recipe 'redisio::enable'
    chef.add_recipe 'chat::packages'
    chef.add_recipe 'chat::nodejs'
    chef.add_recipe 'chat::nginx'
    chef.add_recipe 'chat::setup'

    chef.json = {
      :chat => {
        :packages => %W{ vim git curl },
        :npm_packages => %W{ pm2 bower gulp }
      }
    }
  end

  # Configuration du host manager
  config.hostmanager.enabled = true
  config.hostmanager.manage_host = true

  # Setup de l'ip par rapport aux paramètres globaux
  config.vm.hostname = project_name + '.dev'
  config.vm.network :private_network, ip: ip_address
  config.vm.provision :hostmanager

end
