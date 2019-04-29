#!groovy

def kubectlTest() {
    // Test that kubectl can correctly communication with the Kubernetes API
    echo "running kubectl test"
    sh "kubectl get nodes"

}

def helmLint(String chart_dir) {
    // lint helm chart
    sh "/usr/local/bin/helm lint ${chart_dir}"

}

def helmDeploy(Map args) {
    //configure helm client and confirm tiller process is installed

    if (args.dry_run) {
        println "Running dry-run deployment"

        sh "/usr/local/bin/helm upgrade --dry-run --debug --install ${args.name} ${chart_dir} --set ImageTag=${build_tag},Replicas=${args.replicas},Cpu=${args.cpu},Memory=${args.memory},DomainName=${args.name} --namespace=jenkins-auto  --values=${args.values}"
    } else {
        println "Running deployment"
        sh "/usr/local/bin/helm upgrade --install ${args.name} ${chart_dir} --set ImageTag=${build_tag},Replicas=${args.replicas},Cpu=${args.cpu},Memory=${args.memory},DomainName=${args.name} --namespace=jenkins-auto --values=${args.values}"

        echo "Application ${args.name} successfully deployed. Use helm status ${args.name} to check"
    }
}




node {
    
    // Setup the Docker Registry (Docker Hub) + Credentials 
    registry_url = "https://docker-repo.bloomington.in.gov/cob" // Docker Repo
    docker_creds_id = "9617fef9-766f-4374-9304-43ca4ef33834" // name of the Jenkins Credentials ID
    
    //sh "git rev-parse --short HEAD > /tmp/timetrack_commitrev"
    //build_tag = readFile '/tmp/timetrack_commitrev' // default tag to push for to the registry
    build_tag = "${env.GIT_COMMIT}"
    def pwd = pwd()
    def chart_dir = "${pwd}/charts/open311-nodejs"
        
    stage 'Checking out GitHub Repo'
    checkout scm

  //  def inputFile = readFile('JenkinsConfig.json')
  //  def config = new groovy.json.JsonSlurperClassic().parseText(inputFile)
  //  println "pipeline config ==> ${config}"
    
    stage 'Building open311-nodejs container'
    docker.withRegistry("${registry_url}", "${docker_creds_id}") {
    
        // Set up the container to build 
        maintainer_name = "Seth Tierney"
        container_name = "cob/open311-nodejs"
        

        stage "Building"
        echo "Building Nginx with docker.build(${maintainer_name}/${container_name}:${build_tag})"
        container = docker.build("${container_name}:${build_tag}", '.')
        try {
            
            // Start Testing
            stage "Testing container"
            
            // Run the container with the env file, mounted volumes and the ports:
            docker.image("${container_name}:${build_tag}").withRun("--name=${container_name}  -p 3000:3000 ")  { c ->
                   
                // wait for the django server to be ready for testing
                // the 'waitUntil' block needs to return true to stop waiting
                // in the future this will be handy to specify waiting for a max interval: 
                // https://issues.jenkins-ci.org/browse/JENKINS-29037
                //
                waitUntil {
                    sh "ss -antup | grep 3000 | grep LISTEN | wc -l | tr -d '\n' > /tmp/wait_results"
                    wait_results = readFile '/tmp/wait_results'

                    echo "Wait Results(${wait_results})"
                    if ("${wait_results}" == "1")
                    {
                        echo "node is listening"
                        sh "rm -f /tmp/wait_results"
                        return true
                    }
                    else
                    {
                        echo "node is not listening yet"
                        return false
                    }
                } // end of waitUntil
                
                // At this point Nginx is running
                echo "Docker Container is running"
                input 'You can Check the running Docker Container on docker builder server now! Click process to the next stage!!'    
                // this pipeline is using 3 tests 
                // by setting it to more than 3 you can test the error handling and see the pipeline Stage View error message
                MAX_TESTS = 3
                for (test_num = 0; test_num < MAX_TESTS; test_num++) {     
                   
                    echo "Running Test(${test_num})"
                
                    expected_results = 0
                    if (test_num == 0 ) 
                    {
                        // Test we can download the home page from the running django docker container
                        sh "docker exec -t ${container_name} curl -s http://localhost:3000 | grep Welcome | wc -l | tr -d '\n' > /tmp/test_results" 
                        expected_results = 1
                    }
                    else if (test_num == 1)
                    {
                        // Test that port is exposed
                        echo "Exposed Docker Ports:"
                        sh "docker inspect --format '{{ (.NetworkSettings.Ports) }}' ${container_name}"
                        sh "docker inspect --format '{{ (.NetworkSettings.Ports) }}' ${container_name} | grep map | grep '3000/tcp:' | wc -l | tr -d '\n' > /tmp/test_results"
                        expected_results = 1
                    }
                    else if (test_num == 2)
                    {
                        // Test there's nothing established on the port:
                        sh "docker exec -t ${container_name} ss -apn | grep 3000 | grep ESTABLISHED | wc -l | tr -d '\n' > /tmp/test_results"
                        expected_results = 0
                    }
                    else
                    {
                        err_msg = "Missing Test(${test_num})"
                        echo "ERROR: ${err_msg}"
                        currentBuild.result = 'FAILURE'
                        error "Failed to finish container testing with Message(${err_msg})"
                    }
                    
                    // Now validate the results match the expected results
                    stage "Test(${test_num}) - Validate Results"
                    test_results = readFile '/tmp/test_results'
                    echo "Test(${test_num}) Results($test_results) == Expected(${expected_results})"
                    sh "if [ \"${test_results}\" != \"${expected_results}\" ]; then echo \" --------------------- Test(${test_num}) Failed--------------------\"; echo \" - Test(${test_num}) Failed\"; echo \" - Test(${test_num}) Failed\";exit 1; else echo \" - Test(${test_num}) Passed\"; exit 0; fi"
                    echo "Done Running Test(${test_num})"
                
                    // cleanup after the test run
                    sh "rm -f /tmp/test_results"
                    currentBuild.result = 'SUCCESS'
                }
            }
            
        } catch (Exception err) {
            err_msg = "Test had Exception(${err})"
            currentBuild.result = 'FAILURE'
            error "FAILED - Stopping build for Error(${err_msg})"
        }
        
        stage "Pushing"
        input 'Do you approve Pushing?'
        container.push()
        
        currentBuild.result = 'SUCCESS'
        
    }
    
    stage ('helm test') {
        
    // run helm chart linter
      helmLint(chart_dir)

    // run dry-run helm chart installation
      helmDeploy(
        dry_run       : true,
        name          : "open311-nodejs-dryrun",
        replicas      : "1",
        cpu           : "1",
        memory        : "1024M",
        values        : "/opt/helm/open311-nodejs-dev.values.yml"
       )

    }
    
    stage ('helm deploy') {
      
      // Deploy using Helm chart
      helmDeploy(
        dry_run       : true,
        name          : "open311-nodejs",
        replicas      : "1",
        cpu           : "1",
        memory        : "1024M",
        values        : "/opt/helm/open311-nodejs-dev.values.yml"
      )

    }
}