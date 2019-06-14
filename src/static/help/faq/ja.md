<div class="ui warning message">
<div class="header">ヒント</div>
Online Judgeのプラットフォームとルールに慣れていない場合は、このFAQを読む前に、Google、Baidu、その他の検索エンジンを使用してOnline Judge自体のエコシステムを理解することをお勧めします。
(関連コンテンツ:<a href="https://en.wikipedia.org/wiki/Competitive_programming" target="_blank">Wikipedia-Competitive programming</a>)。
<br>
このプラットフォームの詳細については、このリンクにアクセスしてください。:<a href="about" target="_blank">About</a>
<br>
プラットフォームを構築するために使用されるオープンソースプロジェクトの詳細については、このリンクにアクセスしてください。:<a href="opensource" target="_blank">Open Source Announcement</a>
<br>
ICPCコンテストについては、検索エンジンを使用して、この記事を読んでください: <a href="icpc" target="_blank">What is ICPC</a>
</div>

Author: [Ryan Lee(李昊元)](/user/2016011253)

<div class="ui message">
<div class="header">相性ヒント</div>
このシステムは、フロントエンド開発用の最新バージョンのChromeブラウザに基づいています。すべての機能が正しく機能することを確認するために、推奨設定コンピュータを使用してアクセスすることをお勧めします:
<br>
* <b>解像度は1440×900以上</b><br>
* <b>Windows 7 x64/MacOS 10.12 x64/Ubuntu 14.04 x64 or higher</b><br>
* <b>Chrome / Firefox / ChromiumベースのEdgeブラウザの最新バージョン</b><br>
* <b>2GB以上のメモリ</b><br>
</div>

## 私のコードを提出するにはどうすればいいですか？

1.アカウントを登録する

2.問題を入力してください

3.コードをWebIDEに貼り付けます

4.送信をクリックして、審査結果を待ちます。
```cpp
   if(AC) goto 2;
   else {
       debug;
       goto 3;
   }
```
## 私のコードはどの環境で動作しますか？

- CPU:Intel(R) Xeon(R) CPU E5-2609 0 @ 2.40GHz
- RAM:16GB
- OS:CentOS 7
- GCC:9.1.0
- Clang:LLVM 6.0.0
- Java:6/7/8/10(OpenJDK)
- JavaScript:Node.JS Latest
- Python:CPython/PyPy
## 私のコンパイル環境は何ですか？

| コンパイラ（言語） | コマンド                                                                                                        |
|:------------------:| -------------------------------------------------------------------------------------------------------------- |
| GCC(C/C++)         | `gcc/g++ -fmax-errors=10 -fno-asm -Wall -O2 -lm --static -std=c++${version} -DONLINE_JUDGE -o Main Main.cc `   |
| Clang(C/C++)       | `clang/clang++ Main.cc -o Main -ferror-limit=10 -fno-asm -Wall -lm --static -std=c++${version} -DONLINE_JUDGE` |
| Java               | `java -J${java_xms} -J${java_xmx} -encoding UTF-8 Main.java`                                                   |
| Python             | None                                                                                                           |
| JavaScript         | None                                                                                                           |
| fpc(Pascal)        | `fpc Main.pas -Cs32000000 -Sh -O2 -Co -Ct -Ci`                                                                 |



## サーバーから入力を受け取り結果を出力するにはどうすればよいですか。

ジャッジマシンは `stdin`を使った入力だけを受け付けて結果を`stdout`に出力します。 すべてのファイル操作は禁止されています
## ジャッジマシンによって返された結果はどういう意味ですか？

| Judge Results | Meaning |
| -------------------------- | -------------------------------------------- |
|Waiting / Waiting | 評価キューがコードを評価するのを待っています |
| Compiling/Compiling | システムはコードをコンパイルしています |
| Running/Running and Judging | システムはプログラムを実行し、判断しています |
| Accept / Answer Correct | コードはすべての評価サンプルに合格 |
| Presentation Error / Format Error | コード結果はすべてのサンプルに合格することができますが、トピックの要件を満たすフォーマットはありません。 |
| Wrong Answer / Answer Error | コードがすべての評価例に合格しなかった 
|Time Limit Exceeded/Time Overrun | コードが時間切れになり、プログラムが早期に強制終了された |
|Memory Limit Exceeded/Memory Overrun | コードがメモリ不足になり、プログラムが早期に強制終了される |
|Output Limit Exceeded/Output Limit | コードが正しい出力（通常は正しい出力長の2倍以上）を使い果たすか、**出力ファイルに対する評価マシンの制限（256 MB）を超えています** |
|Runtime Error/Run Error |実行中にコードエラーが発生しました/不正なメモリ領域へのアクセス/不正な呼び出しシステム操作/浮動小数点数のゼロ除算エラー/システムエラー |
| Compile Error | コンパイル中にエラーが発生しました、コンパイルは失敗しました |
|Add to queue/joined queue | リモートサーバーに送信要求を送信するのを待っている、クローラー送信キューにコードが追加されました |
| Server Refuse/Submission rejected by server | 無効なコード/ターゲットサーバーのステータスなどにより、コードがターゲットサーバーに正常に送信されませんでした。 |
| System Error / System Error | 予期しない理由により、システムは評価を完了できませんでした |


## どうやってOJのプログラムを書くことができますか？

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

**注意：Javaプログラムはメインクラスとして `Main`を持っていなければなりません、そうでなければコンパイルエラーが返されます**

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
`main`関数の戻り値は` int`、 `void main（）`でなければならず、その他の標準的ではない書き込みは許可されません。
2. 64ビット整数の場合、変数を `__int64`の代わりに` long long / unsigned long long`で宣言し、入出力には `％lld`または`％llu`を使用してください。
よく知られた理由で、 `cin`と` cout`は `scanf`と` printf`より遅いです。 したがって、データの読み書きには後者の2つを使用することをお勧めします。 (実際、 `cin`と` cout`は必ずしも `scanf`と` printf`よりも遅いわけではありません。詳しくは、[Emotional Comparison Machine Efficiency](/discuss/thread/8)と[cin Acceleration](http://www.hankcs.com/program/cpp/cin-tie-with-sync\_with\_stdio-acceleration-input-and-output.html)を調べてください)
#### Java
1.送信されたコードに含まれるパブリッククラスは1つだけです。 クラス名は `Main`でなければならず、クラス` Main`は `public`に設定されなければなりません。
2. `Main`クラスには` static main`メソッドがなければならず、そのメソッドが `void`を返すことを確認してください
#### other languages

他の言語（Javaを含む）の制限時間とメモリー制限は、通常C / C ++の2倍です。

## 私のコードが私のPCで正しい答えを出力することができるのに、なぜ私の提出は "Accept"を得ないのですか？

サンプル問題ショーはサーバーで可能性のあるテストデータの1つです。 たぶんあなたはあなたが予想外の他の可能性について考えて、あなたのコードを再チェックするべきです。
