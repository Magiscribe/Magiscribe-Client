# ![Dashboard](docs/banner.png) <!-- omit in toc -->

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7332a8.svg?style=for-the-badge&logo=vite&logoColor=white)
![React](https://img.shields.io/badge/React-58c4dc.svg?style=for-the-badge&logo=react&logoColor=white)
![AWS](https://img.shields.io/badge/-AWS-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white)

---

# Table of Contents <!-- omit in toc -->

- [Overview](#overview)
- [Zero to Hero](#zero-to-hero)
  - [Pre-requisites](#pre-requisites)
  - [General Setup](#general-setup)

# Overview

This repository contains a Node.js Vite application that serves as the dashboard for the project. The application is built using TypeScript and React.

# Zero to Hero

### Pre-requisites

- [ ] [Node.js](https://nodejs.org/en) (version 20.x or later)
- [ ] [AWS CLI](https://aws.amazon.com/cli)
- [ ] [Terraform CDKTF](https://learn.hashicorp.com/tutorials/terraform/cdktf-install)
- [ ] [Docker](https://www.docker.com/get-started)

### General Setup

> The following steps are required to setup the project for local development and deployment.

1. Configure AWS CLI. You can do this with `aws configure`. If the environment you working with is managed by AWS SSO, you can run `aws configure sso`. For more on this see [AWS CLI Configuration](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html).

2. Enable `corepack` for `pnpm` to install the dependencies. You can do this by running the following command:

```bash
corepack enable pnpm
```

3. Download the repository

```bash
git clone git@github.com:Magiscribe/Dashboard.git
```

4. Change directory to the project root

```bash
cd Dashboard
```

5. Install the dependencies

```bash
pnpm install
```

6. Copy the `.env.example` file to `.env` and update the values accordingly.

```bash
cp .env.example .env
```

7. Run the development server

```bash
pnpm dev
```

8. Congratulations! You have successfully setup the project for local development.
