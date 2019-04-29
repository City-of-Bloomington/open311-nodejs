#!groovy

def helmLint(String chart_dir) {
    // lint helm chart
    sh "/usr/local/bin/helm lint ${chart_dir} --values ${chart_values}"

}

def helmDeploy(Map args) {
    //configure helm client and confirm tiller process is installed

    if (args.dry_run) {
        println "Running dry-run deployment"

        sh "/usr/local/bin/helm upgrade --dry-run --debug --install ${args.name} ${chart_dir} --set image.tag=${build_tag},Replicas=${args.replicas},Cpu=${args.cpu},Memory=${args.memory},DomainName=${args.name} --namespace=jenkins-auto --values ${chart_values}"
    } else {
        println "Running deployment"
        sh "/usr/local/bin/helm upgrade --atomic --recreate-pods --install ${args.name} ${chart_dir} --set image.tag=${build_tag},Replicas=${args.replicas},Cpu=${args.cpu},Memory=${args.memory},DomainName=${args.name} --namespace=jenkins-auto --values ${chart_values}"

        echo "Application ${args.name} successfully deployed. Use helm status ${args.name} to check"
    }
}

node {
    
    // Setup the Docker Registry (Docker Hub) + Credentials 
    registry_url = "https://docker-repo.bloomington.in.gov/cob" // Docker Repo
    docker_creds_id = "9617fef9-766f-4374-9304-43ca4ef33834" // name of the Jenkins Credentials ID
    
    sh "git rev-parse --short HEAD > /tmp/timetrack_commitrev"
    build_tag = readFile '/tmp/timetrack_commitrev' 
    build_tag = build_tag.trim() // stops issues with newlines on end of commit tag

    pwd = pwd()
    chart_dir = "${pwd}/charts/open311-nodejs"
    chart_values = "/opt/helm/open311-nodejs-dev.values.yaml"
        
    stage ('Checking out GitHub Repo'){
    checkout scm
    //git 'https://github.com/City-of-Bloomington/open311-nodejs'
    }

    stage ('Building open311-nodejs container'){
        docker.withRegistry("${registry_url}", "${docker_creds_id}") {
        
            // Set up the container to build 
            maintainer_name = "Seth Tierney"
            container_name = "cob/open311-nodejs"
            app_name = "open311-nodejs"
            

            stage "Building"
            echo "Building with docker.build(${maintainer_name}/${container_name}:${build_tag})"
            container = docker.build("${container_name}:${build_tag}", '.')

            container.push()
        }
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
        memory        : "1024M"
       )

    }
    
    stage ('helm deploy') {
      
      // Deploy using Helm chart
      helmDeploy(
        dry_run       : false,
        name          : "open311-nodejs-jenkins",
        replicas      : "1",
        cpu           : "1",
        memory        : "1024M"
      )

    }
}