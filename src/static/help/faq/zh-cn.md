<div class="ui warning message">
<div class="header">提示</div>
若您对平台使用方法、OJ模式相关问题不够了解，建议使用Google、百度等搜索引擎搜索后，再阅读本<b>FAQ</b>中的内容(如<a href="https://zh.wikipedia.org/wiki/%E5%9C%A8%E7%BA%BF%E5%88%A4%E9%A2%98%E7%B3%BB%E7%BB%9F" target="_blank">Wikipedia-在线评测系统</a>)。
<br>平台开发相关信息，请访问<a href="about" target="_blank">关于</a><br>关于本平台使用的开源项目，请访问<a href="opensource" target="_blank">开放源代码声明</a><br>想要了解关于<b>ICPC竞赛</b>的资讯，请善用搜索引擎，并阅读<a href="icpc" target="_blank">什么是ICPC</a>
</div>
<div class="ui positive message">
<div class="header">Multiple language support</div>
This page has multiple language version.<br>
If you don't familiar with current language, you can select the language you want by hovering "语言/Language" menu and choose the language you want.<br>
このページは多言語のバージョンで利用できます。<br>
言語がわからない場合は、右上の言語ボタンを利用して、適当な言語を選択してください。<br>
</div>

作者:[Ryan Lee(李昊元)](/user/2016011253)

<div class="ui message">
<div class="header">兼容性提示</div>
本系统基于最新版本的Chrome浏览器进行前端开发，为了保证所有功能正常工作，建议使用推荐配置计算机进行访问:<br>
* <b>分辨率不低于1440×900</b><br>
* <b>Windows 7以上的64位现代操作系统/macOS 10.12以上的64位操作系统/Ubuntu 14.04以上的64位操作系统</b><br>
* <b>最新版本的Chrome浏览器/Firefox浏览器/基于Chromium内核的Edge浏览器</b><br>
* <b>2GB以上的内存</b><br>
</div>

## 我如何能够提交我的代码?

1. 注册一个账号
2. 进入一个题目
3. 粘贴你的代码
4. 点击提交，查看返回结果
```cpp
   if(AC) goto 2;
   else {
       debug;
       goto 3;
   }
```
## 我的代码在什么环境上运行？

- CPU:Intel(R) Xeon(R) CPU E5-2609 0 @ 2.40GHz
- RAM:16GB
- OS:CentOS 7
- GCC:9.1.0
- Clang:LLVM 6.0.0
- Java:6/7/8/10(OpenJDK)
- JavaScript:Node.JS Latest
- Python:CPython/PyPy
## 我的编译环境是什么？
当前环境编译指令请点击前往[编译指令](/system/compile_arguments)

| Compiler(Language) | Command                                                                                                        |
|:------------------:| -------------------------------------------------------------------------------------------------------------- |
| GCC(C/C++)         | `gcc/g++ -fmax-errors=10 -fno-asm -Wall -O2 -lm --static -std=c++${version} -DONLINE_JUDGE -o Main Main.cc `   |
| Clang(C/C++)       | `clang/clang++ Main.cc -o Main -ferror-limit=10 -fno-asm -Wall -lm --static -std=c++${version} -DONLINE_JUDGE` |
| Java               | `java -J${java_xms} -J${java_xmx} -encoding UTF-8 Main.java`                                                   |
| Python             | None                                                                                                           |
| JavaScript         | None                                                                                                           |
| fpc(Pascal)        | `fpc Main.pas -Cs32000000 -Sh -O2 -Co -Ct -Ci`                                                                 |



## 我如何从评测机获得输入，并将结果输出？

评测机仅接受使用`stdin`进行输入，并将结果输出到`stdout`中。所有文件操作均被禁止使用

## 评测机返回的结果代表什么意思?

| 评测结果                       | 含义                                           |
| -------------------------- | -------------------------------------------- |
| Waiting/等待                 | 等待评测队列对代码进行评测                                |
| Compiling/编译中              | 系统正在编译代码                                     |
| Running/运行并评判              | 系统正在运行程序，并进行评判                               |
| Accept/答案正确                | 代码通过所有的评测样例                                  |
| Presentation Error/格式错误    | 代码结果可以通过所有样例，但是没有符合题目要求的格式                   |
| Wrong Answer/答案错误          | 代码没有通过所有的评测样例                                |
| Time Limit Exceeded/时间超限   | 代码运行的时间超出了题目的要求，程序被提前强行终止                    |
| Memory Limit Exceeded/内存超限 | 代码运行的内存超出了题目的要求，程序被提前强行终止                    |
| Output Limit Exceeded/输出超限 | 代码运行结果超出正确输出(一般是超出正确输出长度两倍以上)或**超出评测机对输出文件的限制(256MB)**                |
| Runtime Error/运行错误         | 代码在运行过程中出现段错误/访问非法内存空间/非法调用系统操作/浮点数除零错误/系统错误 |
| Compile Error/编译错误         | 编译过程中发生错误，编译失败                               |
| Add to queue/已加入队列         | 代码已加入爬虫提交队列，等待向远程服务器发送提交请求                   |
| Server Refuse/提交被服务器拒绝     | 由于代码不合法/目标服务器状态非法等原因，代码没有成功提交至目标服务器          |
| System Error/系统错误          | 由于不可预料的原因，系统无法完成评测                           |

### 特别说明:格式错误(2018/09/24 新增)
> 什么是格式错误？

格式错误是你的答案和标准输出的答案一致，但是控制字符/换行字符/空格数量与标准答案不同的情况。
例如:
|期望输出|实际输出 |
|:-|:-|
|a&nbsp;&nbsp;=&nbsp;&nbsp;b(间隔两个空格)|a=b|
这种时候判题机会返回**格式错误**
以下情况也会被认为是格式错误:
|期望输出|实际输出 |
|:-|:-|
|* * \*<br>&nbsp;* *<br>&nbsp;&nbsp;\*|* * \*<br>&nbsp;* *&nbsp;<br>&nbsp;&nbsp;\*&nbsp;&nbsp;|
以上两个的区别是:期望输出的右边**直接是换行，没有空格**
但是，以下的输出不会被认为是格式错误，而是认为是**答案正确**
|期望输出|实际输出|
|-|-|
|Hello,world!\n|Hello,world!|
这是因为判题机会**自动忽略最后一行行尾的换行符、空格以及控制字符**，至于为什么会做这个处理，将在其他的文章中讨论。

### 特别说明:时间超限(2018/09/24 新增)
> 时间超限指的是程序在执行过程中使用的CPU时间超过了题目的要求，抑或**由于程序基本没有使用CPU时间,但是始终处于运行状态超过了一定时间**(这里一般是10倍CPU限制时间)判题机将会返回时间超限。

一般来说，时间超限可能因为程序的多项式时间超出题目要求所导致的。比如题目对于CPU时间限制为$1\text{sec}$,对应简单操作$3\times10^9$次。若输入规模$n$,程序多项式时间函数$f(x)$,则有$f(n) \leq 1\times3\times 10^9$(事实上这并不严谨，只是一个为了方便理解的类比)。若$f(x)$不能满足限制，则**大概率无法在指定时间内运行结束**(这里还有一些神奇的玄学或编译器的编译期优化，以及循环展开等问题造成的影响，不予讨论)

但是有一些特殊情况也会造成时间超限。例如**程序无法申请足够的内存，导致在不占用CPU时间的情况保持使能状态直到运行时间耗尽**。这时我们不难发现CPU时间并未跑满，而评测机却返回了时间超限。

## 我如何针对OJ编写程序？

以Problem 1000 A+B Problem 为例

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

**注:Java程序必须以`Main`作为主类，否则将返回编译错误**

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

## 注意事项

#### C/C++

1. `main`函数的返回值必须为`int`,`void main()`等非标准的写法将不被允许
2. 对于64位整数，请使用`long long/unsigned long long`而不是`__int64`声明变量，并使用`%lld`或`%llu`输入输出
3. 由于众所周知的原因，`cin`和`cout`的速度慢于`scanf`以及`printf`。因此我们推荐使用后两者读写数据。(事实上`cin`以及`cout`并不一定比`scanf`和`printf`慢。详情见[感性对比评测机效率](/discuss/thread/8)以及[cin加速](http://www.hankcs.com/program/cpp/cin-tie-with-sync\_with\_stdio-acceleration-input-and-output.html))

#### Java

1. 提交的代码中只能存在一个public 类,该类名必须为`Main`,类`Main`必须设置为`public`
2. `Main`类中必须存在一个`static main`方法，并保证该方法返回`void`

#### 其他语言

其他语言(包括Java)的时限和内存限制一般是C/C++的两倍

## 我明明本地跑样例过了，为什么提交没有AC?
样例只是题目所有测试点中的一个例子，不代表你的代码能够通过所有测试点的测试。请认真思考后修改你的代码
