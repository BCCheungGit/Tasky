# TASKY

## Table of Contents
1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Usage](#usage)
4. [Implementation](#implementation)

## Introduction
What is Tasky? <br/>
Tasky is a project management/task management app, authored by Ben Cheung, and created for the class CSCI-UA467 at NYU. <br/>
It allows users to create and manage organizations, then assign tasks to users in those organizations (similar to a program like Google Classroom). <br/>
Tasky can also be used for personal reasons, without having to specifiy an organization.

## Installation
1. Clone this repository
```bash
git clone https://github.com/BCCheungGit/Tasky 
```

2. cd into the repository
```bash
cd Tasky
```

3. Install dependencies
```bash
npm install 
# or
yarn install
# or
pnpm install
# or
bun install
```

4. Run locally
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
#or
bun dev
```
5. Open [http://localhost:23165](http://localhost:23165) with your browser to see the result.

## Usage
The site is currently running on vercel, at [this link](https://tasky-ten-green.vercel.app/)
To get started, create an account. You can then create tasks (select personal in the drop down) for yourself, or you can create an organization. Upon creating an organization, you should get a join code that can be used by other users to join the organization. Owners may then assign tasks to users who join their organization. 


## Implementaion
Tech Stack:
- Next.js
- Tailwind CSS
- ShadCN UI
- MongoDB
- NextAuth.js

For the task table I copied the code from ShadCN's example github repository, modifying slightly to fit my needs. 



