---
title: "Introduction to DevOps and Key Practices"
subtitle: "A detailed overview of DevOps and its key practices, including Continuous Integration, Continuous Deployment, Testing, Infrastructure as Code, and Configuration Management."
date: "12/9/2024"
---

## Introduction to DevOps

A starting point could be to ask the question: What is DevOps?
At its core, DevOps is a cultural movement and set of practices that streamline workflows and shorten development cycles. It's about the unification of development and operations, breaking down the silos between the two teams, and enabling faster and more reliable software delivery. The goal is to close the gap between development, operations, and business; it is for practitioners by practitioners.

## Development vs Operations

Development Team vs Operations Team
The development team writes, tests, and maintains the code. Quickly and efficiently. Their objective is speed.
Operations team is responsible for maintaining the infrastructure and environment that the code runs on. They are responsible for the system's uptime, performance, security, and stability.
In a non-DevOps environment, these two teams are siloed. As in, they are separated and do not communicate with each other. Leading to delays, inefficiencies, and miscommunication. DevOps is about breaking down these silos and enabling collaboration between the two teams.

## DevOps Objectives

Thus we can now precisely define the objectives of DevOps:

- Increase deployment frequency
- Ensure product quality
- Ensure product resilience and recoverability
- Security of the product

## Agile and DevOps

Agile is a methodology that emphasizes collaboration, customer feedback, and small, rapid releases. Instead of the traditional waterfall model, where the entire project is planned out in advance, Agile breaks the project into smaller, more manageable pieces called sprints. This allows for more flexibility and adaptability, as the project can be adjusted as needed. Each sprint ends with a review and retrospective, where the team can discuss what went well, what didn't, and what can be improved.
However, Agile focuses on the flow of work and omits the operations part. That's where DevOps comes in. DevOps is the missing piece of Agile. By taking modest actions and receiving input from customers, and connecting the feedback to the development process, teams can deliver value faster and with higher quality.
Below is a flowchart representing the whole process:

![DevOps](/Figures/DevOpsArticle/DevOpsDiagram.jpg)

## Silo Approach in Traditional IT

The silo approach refers to the division of the operations and development teams. Information is lost each time there is a context change between the two teams. Efficiency is diminished. This is what we are trying to avoid with DevOps.

## Key DevOps Practices

### Build Automation

Build automation is the practice of automating the process of compiling code, packaging it into compressed files, and making changes to the database. This ensures that the process is repeatable and dependable and gets rid of human error and flaws. We require extensive documentation for this. Jenkins, Travis CI, Circle CI, GitLab CI, Bamboo, TeamCity, and other tools are used for this.

### Continuous Integration (CI):

Continuous integration is the practice of automating the integration of code changes from multiple contributors into a single software project. We are going to merge small changes frequently. This is done to avoid integration hell. Developers commit their code and get instant feedback. If there are errors we roll back to a stable version. Below is an example of a continuous Integration delivery.

![CI pipeline](/Figures/DevOpsArticle/CIPipeline.jpg)

### Continuous Deployment and Continuous Delivery (CD/CD):

Since it automatically distributes all code changes to a testing and/or production environment following the build step, continuous delivery is an extension of continuous integration. Beyond Continuous Delivery, there is also Continuous Deployment. With this method, any update that passes all stages of your production pipeline is distributed to your consumers.

![CD pipelien](/Figures/DevOpsArticle/CDPipeline.jpg)

### CI/CD Costs:

There are pros and cons associated with CI/CD.
The pros of Continuous Integration and Continuous Deployment are:

- Faster time to market
- Lower risk of failure
- Faster Feedback to developers
- More reliable releases
  The cons of Continuous Integration and Continuous Deployment are:
- Server costs
- testing costs
  There is also a need for a strong test suite for CI/CD to be effective.

## Testing in DevOps

A crucial step in the DevOps process is testing. It makes sure that the code is operating as intended and that any modifications don't create new problems or bugs. This is a significant aspect of automation that is carried out consistently during the development process.
Following types of testing are commonly used in DevOps:

- Unit Testing: Testing individual units or components of the code. These are simple tests that are easy to automate and run.
- Integration Testing: Test how different parts of the system work together. These tests are more complex than unit tests and can include things like testing how an application works with a database, or how different microservices work together using APIs.
- Functional Testing: Tests the functionality of the software. This is done to ensure that the software meets the requirements and specifications. Ex: User interface tests.
- End-to-end Testing: Tests the entire application from start to finish from user's perspective. This is done to ensure that the application works as expected in a real-world scenario.
- Acceptance and performance testing: Tests the performance of the application under different conditions. Ex: Load testing, stress testing, etc.

## Infrastructure as Code (IaC):

Infrastructure is used to refer to the servers, databases, and other components that are needed to run the software. However, in today's world, we have virtual machines and containers for this. AWS and Azure are examples of cloud providers. We write JSON or yaml files to define the infrastructure. This is called Infrastructure as Code. (IaC). We manage the infrastructure in the same way that we manage the code. This allows us to automate the process of provisioning and managing the infrastructure.

## Configuration Management

Configuration management is the practice of automating the process of managing the configuration of the infrastructure. This includes things like installing software, configuring settings, and managing updates. Configuration management tools like Ansible, Puppet, and Chef are used to automate this process.

## Bringing it all together

- We have developers that write code and push it to the repository. Here it is tested and built. (Unit Tests and Integration Tests).
- Then the code is set in a software package.
- Then we need Iac to set up the infrastructure. (set up VMs, containers, Monitor, etc.) Can use configuration management tools for this.
  The test Environment is set up, and the code is deployed to the test environment.
- Testings are done. (Functional, End-to-End, Acceptance, and Performance tests).
- If the tests pass, the code is deployed to the production environment.

![Entire Pipeline](/Figures/DevOpsArticle/EntireCICDpipeline.jpg)
