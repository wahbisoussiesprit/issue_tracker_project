Vagrant.configure("2") do |config|
  config.vm.box = "ubuntu/jammy64" # Ubuntu 22.04 LTS
  config.vm.hostname = "devops-ubuntu"
  
  # Network: allow access from your Windows host
  config.vm.network "forwarded_port", guest: 8080, host: 8080  # Jenkins
  config.vm.network "forwarded_port", guest: 9000, host: 9000  # SonarQube
  config.vm.network "forwarded_port", guest: 3000, host: 3000  # Grafana
  config.vm.network "forwarded_port", guest: 9090, host: 9090  # Prometheus

  # VM Resources
  config.vm.provider "virtualbox" do |vb|
    vb.name = "devops-lab"
    vb.memory = "4096"
    vb.cpus = 2
  end

  # Provisioning Script
  config.vm.provision "shell", path: "provision.sh"
end
