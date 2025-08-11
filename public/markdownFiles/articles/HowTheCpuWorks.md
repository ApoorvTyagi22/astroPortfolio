---
title: "How the Central Processing Unit (CPU) Works in a Computer System"
subtitle: "An overview of how the central processing unit (CPU) works in a computer system, including the role of the CPU, registers, and different types of memory."
date: "7/7/2024"
---

## Introduction

This article will provide an overview of how the central processing unit (CPU) works. The CPU is the brain of the computer, and it is responsible for executing instructions and performing calculations. Understanding how the CPU works is essential for anyone interested in computer science or technology. This article will cover the basics of the CPU architecture and the role of the CPU in a computer system.

## Role of the CPU

Computer systems consist of hardware and software components and follow the concept of input, process, and output, storage models. A computer system accepts data or instructions, as input from an input device then this data is processed by the computer system. Finally, the computer system outputs the processed data into information that we can see and use, this output is also stored in the storage.

The data is processed in the CPU. It is a hardware component of a computer system and can perform basic arithmetic, logical, or input/output operations in order to process data from input devices into useful information. The CPU can only retrieve data from the input or primary memory, of the computer system.

## CPU Architecture

• The CPU consists of:

1. Control Unit.
2. Arithmetic logic Unit.
3. Memory address register (MAR).
4. Memory Data Register (MDR).

The Control unit is responsible for the operation of the CPU, it controls the retrieval of instructions, from the primary memory as well as the sequence of their execution.

The arithmetic logic unit (ALU) performs all the basic arithmetic, logical, or input/output operations. The control unit is responsible for providing the ALU with the data that needs to be processed as well as the instructions on how the data should be processed.

The RAM holds both the executing program's instructions and any necessary data. Each piece of information in RAM is stored in a unique memory location, which has both an address and content. The address helps the Control Unit (CU) locate, retrieve, and access the content—whether it's instructions or data—and send it to the Arithmetic Logic Unit (ALU) for processing.

The ROM (Read-only memory) also holds instructions and data in unique memory locations, Every such location has an address as well as the content. But the ROM stores permanent instructions. More on this later.

## Registers

The CU contains various registers, a register is a small memory location that can hold data usually a multiple of 8 bits. A 64-bit computer has 64-bit registers. The basic registers in the CU are the memory address register (MAR) and the memory data register (MDR). The MAR holds the memory address of the data to be used by the ALU so that the ALU can fetch the content and process it accordingly.

In order for the MAR to communicate with the primary memory, a connection is necessary this is established with the help of a Memory address bus. The MDR holds the data that is to be used by the ALU and then saves it to the RAM.

The memory address stored in the MAR is used to locate the corresponding data, which is then placed in the MDR for processing by the ALU. Once the processing is complete, the ALU transfers the result back to the MDR, and the data is written to the RAM at the memory address specified by the MAR.

## Different types of memory

The primary storage is the only memory directly accessible by the CPU. RAM is volatile, which means that when power is lost, the content of the memory is wiped.

ROM is used to store data and cannot be over-written. If power is lost, as such is considered non-volatile. Thus ROM is used to store instructions, that do not need to be updated or changed. Such as the BIOS (basic input/output system).

RAM holds a program that is running and the data used.
RAM has two main types:

1. Dynamic RAM (DRAM)
2. Static RAM (SRAM)

SRAM is faster but more expensive than DRAM, and as such DRAM is preferred for the main RAM of a computer system. However, a small amount of SRAM is placed between the main RAM and the processor and it is called cache.

### Role of the Cache

The cache is a smaller and faster RAM that temporarily stores instructions, and data so that the processor does not need to access the slower main memory (DRAM).
The cache holds the information from the RAM that is most actively used, and accessed most frequently. This will result in a faster computer system, as the slower main memory is used less frequently. When the processor needs to read from the main memory, it first checks if a copy of the data is available in the cache. If the data is not available in the cache it is first copied to the cache and then used.

## The Machine Instruction Cycle

Diagram of the whole process:

![CPU](/Figures/CpuArticle/CpuWorkFlow.jpg)

So the whole cycle of the CPU is as follows:

1. The CPU is responsible, to know which instructions it needs to execute a specific program. to do so it sends the address through the memory address bus to the primary memory. The instructions that reside in that memory are copied and sent to the Control unit.
2. The instructions received by the CU are decoded, enabling the CPU to identify any additional data needed for execution. If more data is required, it is retrieved from the primary memory. The memory addresses for this data are placed on the address bus, and the corresponding data is transferred to the CPU via the data bus.
3. the CPU executes the instructions using the necessary data that have been loaded and calculates a result.
4. After executing the instructions, and computing the result the CPU then stores the result in the primary memory. To do so it specifies an address in the primary memory through the address bus and sends the data there through the data bus.

This is called the machine instruction cycle.
