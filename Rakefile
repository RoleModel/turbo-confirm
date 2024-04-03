require 'open3'

task default: 'dummy:run'

namespace :dummy do
  desc 'Setup the dummy application'
  task :setup do
    Dir.chdir('test/dummy') do
      Open3.popen2e 'bin/setup' do |_,output|
        output.each_line { puts _1 }
      end
    end
  end

  desc 'Run the dummy application on port 3000'
  task run: :setup do
    Dir.chdir('test/dummy') do
      Open3.popen2e({'PORT' => '3000'}, 'foreman start -f Procfile.dev') do |_, output|
        output.each_line { puts _1 }
      end
    end
  end
end

