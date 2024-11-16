**Task #3**

TASK #3 (FOR ALL GROUPS)

For those who have already sent #1 and #2.

Using the language of your choice—from the C#/JavaScript/TypeScript/Java/PHP/Ruby/Python/Rust set, please—to write a console script that implements a generalized dice game (with the supports of arbitrary values on the dice). Of course, it's recommended to use the language of your "specialization," i.e. C# or JavaScript/TypeScript, but it's not required.

When launched with command line parameters—arguments to the main or Main method in the case of Java or C# correspondingly, sys.argv in Python, process.argv in Node.js, etc.—it accepts 3 or more strings, each containing 6 comma-separated integers. E.g., python game.py 2,2,4,4,9,9 6,8,1,1,8,6 7,5,3,7,5,3.

If the arguments are incorrect, you must display a neat error message,not a stacktrace—what exactly is wrong and an example of how to do it right (e.g., user specified only two dice or no dice at all, used non-integers, etc.). All messages should be in English.

Important: dice configuration is passed as command line arguments; you don't "parse" it from the input stream.

The victory is defined as follows—computer and user select different dice, perform their "throws," and whoever rolls higher wins. 

The first step of the game is to determine who makes the first move. You have to prove to the user that choice is fair (it's not enough to generate a random bit 0 or 1; the user needs a proof of the fair play). 

When the users make the throw, they select dice using CLI "menu" and "generate" a random value with the help of the computer. The options consist of all the available dice, the exit (cancel) option, and the help option.

When the computer makes the throw, it selects dice and "generates" a random value. 

Of course, "random" generation is also should be provable fair. 
.
So, you need to implement provable "fair" random integer generation (other from 0 to 1 or from 0 to 5).

To generate such a value, the computer generates a one-time cryptographically secure random key (using corresponding API like SecureRandom, RandomNumberGenerator, etc.—it's mandatory) with a length of at least 256 bits.

Then the computer generates a uniformly distributed integer in the required range (using secure random; note that % operator is not enough to get uniform distribution) and calculates HMAC (based on SHA3) from the generated integers as a message with the generated secret key. Then the computer displays the HMAC to the user. 

After that, the user selects an integer in the same range. The resulted value is calculated as the sum of user number and computer number using modular arithmetic. When the computer displays the result, it also shows the used secret keys.

Re-read the paragraph above; the sequence is critical (it simply doesn't make sense to do it differently, for example, showing the key before the user number selection or displaying HMAC the second time instead of the key, etc.).

Thus the user can check that the computer doesn't cheat (of course, the computer can still try to cheat, but the user can counteract to that).

When you select the "help" option in the terminal, you need to display a table (use ASCII-graphic) that shows probabilities of winning for each dice pair. 
The table generation should be in a separate class. The probability calculation should be in a separate class. The implementation of the fair number generation "protocol" should be in a separate class. The random key/number generation and HMAC calculation should be in a separate class. The dice configuration parsing should be in a separate class. The dice abstraction should be in a separate class. Generally, your code should consist of at least 6-9 classes. 

You should use the core class libraries and third-party libraries to the maximum, and not reinvent the wheel. 

THE NUMBER OF DICE CAN BE ARBITRARY ( > 2). 
Example:
> java -jar game.jar 2,2,4,4,9,9 6,8,1,1,8,6 7,5,3,7,5,3
Let's determine who makes the first move.
I selected a random value in the range 0..1 (HMAC=C8E79615E637E6B14DDACA2309069A76D0882A4DD8102D9DEAD3FD6AC4AE289A).
Try to guess my selection.
0 - 0
1 - 1
X - exit
? - help
Your selection: 0
My selection: 1 (KEY=BD9BE48334BB9C5EC263953DA54727F707E95544739FCE7359C267E734E380A2).
I make the first move and choose the [6,8,1,1,8,6] dice.
Choose your dice:
0 - 2,2,4,4,9,9 
1 - 7,5,3,7,5,3
X - exit
? - help
Your selection: 0 
You choose the [2,2,4,4,9,9] dice.
It's time for my throw.
I selected a random value in the range 0..5 (HMAC=AA29E7275FE17A8D1184E2D4B6B0F46D815224270C94907CF007F2118CF400F7).
Add your number modulo 6.
0 - 0
1 - 1
2 - 2
3 - 3
4 - 4
5 - 5
X - exit
? - help
Your selection: 4
My number is 3 (KEY=7329ABD54A1633D2079EA7A48B401018D7EE6DD4C130AB5C31BC029CC8359637).
The result is 3 + 4 = 1 (mod 6).
My throw is 8.
It's time for your throw.
I selected a random value in the range 0..5 (HMAC=652863C27870CCA331458F4658D89413F405736FE5AA19B868FBDDAB5611A406).
Add your number modulo 6.
0 - 0
1 - 1
2 - 2
3 - 3
4 - 4
5 - 5
X - exit
? - help
Your selection: 5
My number is 0 (KEY=92564A82A515DEBC3FE9842D20DCEA3F3AAFB2080314A09A1E9A2CC729EDAF44).
The result is 0 + 5 = 5 (mod 6).
Your throw is 9.
You win (9 > 8)!
 
The first "fair generatio" (0 or 1) should determine who selects the dice first. The opponents select different dice and after that perform their throws (in fact, the order of throws should be unimportant, because they use different dice). 
To submit the solution  you need to send an e-mail to p.lebedev@itransition.com with the following:
1. a link to a video demonstrating launch with different parameters (4 identical dice 1,2,3,4,5,6 1,2,3,4,5,6 1,2,3,4,5,6 1,2,3,4,5,6 as well as 3 dice 2,2,4,4,9,9 1,1,6,6,8,8 3,3,5,5,7,7), launch with incorrect parameters (no dice; 2 dice; invalid number of sides; non-integer value in the dice configuration), help table with probabilities (on 3 dice from the example), whole game played with the output of results (at least 2 runs);
2. a link to the Github public repository.

Make the video publicly accessible. Don't try to share your video with my work e-mail or something. Make your video public. Don't narrate, no sound.

And as an explanation: when calculating HMAC, the key is the same secret key that you generated. And the message is a number. After getting the key, the user will be able to calculate the HMAC and compare it with the HMAC that was shown before. It's not very difficult. 🙂

Each "fair random" depends on numbers, generated by both players (human and computer). HMAC is used to prove that computer did't change its number after user made the selection.

A common mistake is trying to invent your "HMAC" as a hash of a random "key." This will not work. If you show the same lines before the user selection and after the user selection, the user does not receive new information, and, accordingly, you do not prove anything to him. It is necessary to generate a key (with a secure generator), generate a computer value, calculate HMAC (by a standard algorithm) from a computer value (message) and a key (key), show HMAC, get a user value, calculate the result and show the key. Re-read this paragraph until the total comprehension. 

What is this task for? 

You need to learn how to read and understand the requirements, understand hash functions a little bit deeper, understand what they are for, know the HMAC concept, learn to think about how the exact sequence of steps can give you some kind of proof or contract, work with external libraries, touch on some basics of OOP, and a few other things.

Note that "fair" procedure generates dice face index, not the "result throw." Users can specify any order for face values when they run the application.

Sometimes words aren't enough, so here is a diagram for collaborative random number generation in the range from 0 to 5 inclusive for the TASK #3. 
+---+---------------------------+---------------------+
| # | Computer                  | User                |
+---+---------------------------+---------------------+
| 1 | Generates a random number |                     |
|   | `x ∈ {0,1,2,3,4,5}`       |                     |
+---+---------------------------+---------------------+
| 2 | Generates a secret key    |                     |
+---+---------------------------+---------------------+
| 3 | Calculates and displays   |                     |
|   | `HMAC(key).calculate(x)`  |                     |
+---+---------------------------+---------------------+
| 4 |                           | Selects a number    |
|   |                           | `y ∈ {0,1,2,3,4,5}` |
+---+---------------------------+---------------------+
| 5 | Calculates the result     |                     |
|   | `(x + y) % 6`             |                     |
+---+---------------------------+---------------------+
| 6 | Shows both the result     |                     |
|   | and the key               |                     |
+---+---------------------------+---------------------+
How to improve usability of the console help table (make it more understandable).
First of all, you may render header row with some emphasis. E.g. use some color. 
Second, you fill the headers with some adequate content, like this:
Probability of the win fоr the user:
+-------------+-------------+-------------+-------------+
| User dice v | 2,2,4,4,9,9 | 1,1,6,6,8,8 | 3,3,5,5,7,7 |
+-------------+-------------+-------------+-------------+
| 2,2,4,4,9,9 | - (0.3333)  | 0.5556      | 0.4444      |
+-------------+-------------+-------------+-------------+
| 1,1,6,6,8,8 | 0.4444      | - (0.3333)  | 0.5556      |
+-------------+-------------+-------------+-------------+
| 3,3,5,5,7,7 | 0.5556      | 0.4444      | - (0.3333)  |
+-------------+-------------+-------------+-------------+

Please, remember that integers can be larger than 9, so you cannot predefine the column widths. Anyway, you have to use a 3rd-party library for the table output.

And, last, but not least, you may add some text before the table (e.g., to help to understand the game rules).

Of course, for large number of dice it would be nice to implement some kind of pagination, but it's out of the scope of the basic task (you may consider it as an optional "for the highest grade" problem). 
