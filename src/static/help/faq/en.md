<div class="ui warning message">
<div class="header">Tips</div>
If you don't familiar with the platform and rules of Online Judge, it is recommended to use Google, Baidu and other search engines to understanding the ecosystem of Online Judge itself before reading this <b>FAQ</b>.
(e.g.<a href="https://en.wikipedia.org/wiki/Competitive_programming" target="_blank">Wikipedia-Competitive programming</a>)。
<br>
Learn more about this platform, please access this link:<a href="about" target="_blank">About</a>
<br>
Learn more about the open source project used to build the platform, please access this link:<a href="opensource" target="_blank">Open Source Announcement</a>
<br>
About ICPC Contest, please use search engines, and read this article: <a href="icpc" target="_blank">What is ICPC</a>
</div>

Author: [Ryan Lee(李昊元)](/user/2016011253)

<div class="ui message">
<div class="header">Compatibility tips</div>
This system is based on the latest version of the Chrome browser for front-end development, in order to ensure that all functions work properly, it is recommended to use the recommended configuration computer to access:
<br>
* <b>The resolution is not lower than 1440×900</b><br>
* <b>64-bit modern operating system for Windows 7/64-bit operating system for MacOS 10.12/64/64-bit operating system for Ubuntu 14.04 or higher</b><br>
* <b>The latest version of Chrome/Firefox/Chromium-based Edge browser</b><br>
* <b>more than 2GB of memory</b><br>
</div>

## How to submit my code?

1. Register an account
2. Enter a problem
3. Paste your code to WebIDE
4. Click "submit", and waiting for judging.
```cpp
   if(AC) goto 2;
   else {
       debug;
       goto 3;
   }
```
## What environment does my code run on?

- CPU:Intel(R) Xeon(R) CPU E5-2609 0 @ 2.40GHz
- RAM:16GB
- OS:CentOS 7
- GCC:9.1.0
- Clang:LLVM 6.0.0
- Java:6/7/8/10(OpenJDK)
- JavaScript:Node.JS Latest
- Python:CPython/PyPy
## What is my compiling environment?

| Compiler(Language) | Command                                                                                                        |
|:------------------:| -------------------------------------------------------------------------------------------------------------- |
| GCC(C/C++)         | `gcc/g++ -fmax-errors=10 -fno-asm -Wall -O2 -lm --static -std=c++${version} -DONLINE_JUDGE -o Main Main.cc `   |
| Clang(C/C++)       | `clang/clang++ Main.cc -o Main -ferror-limit=10 -fno-asm -Wall -lm --static -std=c++${version} -DONLINE_JUDGE` |
| Java               | `java -J${java_xms} -J${java_xmx} -encoding UTF-8 Main.java`                                                   |
| Python             | None                                                                                                           |
| JavaScript         | None                                                                                                           |
| fpc(Pascal)        | `fpc Main.pas -Cs32000000 -Sh -O2 -Co -Ct -Ci`                                                                 |



## How do I get input from the judge machine and output the results?

The judge machine only accepts input using `stdin` and outputs the result to `stdout`. All file operations are prohibited
## What does the result returned by the judge machine mean?

| Judge Results | Meaning |
| -------------------------- | -------------------------------------------- |
|Waiting / Waiting | Waiting for the evaluation queue to evaluate the code |
| Compiling/Compiling | System is compiling code |
| Running/Running and Judging | The system is running the program and judging |
| Accept / Answer Correct | Code Passes All Evaluation Samples |
| Presentation Error / Format Error | Code results can pass all samples, but there is no format that meets the requirements of the topic |
| Wrong Answer / Answer Error | Code did not pass all the evaluation examples |
|Time Limit Exceeded/Time Overrun | The code runs out of time and the program is forcibly terminated early |
|Memory Limit Exceeded/Memory Overrun | The code runs out of memory and the program is forcibly terminated early |
|Output Limit Exceeded/Output Limit | The code runs out of the correct output (generally more than twice the correct output length) or **exceeds the evaluation machine's limit on the output file (256MB)** |
|Runtime Error/Run Error | Code error occurred during run/access illegal memory space/Illegal call system operation/float number divide-by-zero error/system error |
| Compile Error | An error occurred during compilation, compilation failed |
|Add to queue/joined queue | code has been added to the crawler submission queue, waiting to send a submit request to the remote server |
| Server Refuse/Submission rejected by server | Code was not successfully submitted to the target server due to invalid code/target server status, etc. |
| System Error / System Error | The system could not complete the evaluation due to unforeseen reasons |


## How can I write a program for OJ?

e.g. Problem 1000 A+B Problem 

### C

```c
#include <stdio.h>
int main()
{
  int a,b;
  scanf("%d%d",&a,&b);
  printf("%d\n");
}
```

### C++

```c++
#include <iostream>
using namespace std;
int main()
{
  int a,b;
  cin >> a >> b;
  cout << a + b << endl;
}
```

### Java

**Note: Java programs must have `Main` as the main class, otherwise a compilation error will be returned**

```java
import java.util.*
public class Main {
	public static void main(String[] args) throws Exception {
  	Scanner in = new Scanner(System.in);
    int a = in.nextInt();
    int b = in.nextInt();
    System.out.println(a+b);
  }
}
```

### Python 2

```python
print sum(map(int,raw_input().split()))
```

### Python 3

```python
print(sum(map(int,input().split()))
```

## Note

#### C/C++

The return value of `main` function must be `int`, `void main()` and other non-standard writing will not be allowed.
2. For 64-bit integers, declare the variable with `long long/unsigned long long` instead of `__int64` and use `%lld` or `%llu` to input and output
3. For well-known reasons, `cin` and `cout` are slower than `scanf` and `printf`. Therefore, we recommend using the latter two to read and write data. (In fact, `cin` and `cout` are not necessarily slower than `scanf` and `printf`. For details, see [Emotional Comparison Machine Efficiency](/discuss/thread/8) and [cin Acceleration](http://www.hankcs.com/program/cpp/cin-tie-with-sync\_with\_stdio-acceleration-input-and-output.html))
#### Java

1. There can only be one public class in the submitted code. The class name must be `Main`, and the class `Main` must be set to `public`.
2. There must be a `static main` method in the `Main` class, and ensure that the method returns `void`
#### other languages

The time limit and memory limit of other languages (including Java) is generally twice that of C/C++.

## Why my submission don't get "Accept" while my code can output currectly answer in my PC?

The sample problem show is just one of possible test data in server. Maybe you should consider about other possibilities you unexpected and recheck your code.
