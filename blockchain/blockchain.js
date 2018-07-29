/* External libraries */

/**
*
*  Secure Hash Algorithm (SHA256)
*  http://www.webtoolkit.info/javascript-sha256.html#.W04GV9UzaUk
*
*  Original code by Angel Marin, Paul Johnston.
*
**/
function SHA256(s){
    var chrsz   = 8;
    var hexcase = 0;
    function safe_add (x, y) {
        var lsw = (x & 0xFFFF) + (y & 0xFFFF);
        var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xFFFF);
    }
    function S (X, n) { return ( X >>> n ) | (X << (32 - n)); }
    function R (X, n) { return ( X >>> n ); }
    function Ch(x, y, z) { return ((x & y) ^ ((~x) & z)); }
    function Maj(x, y, z) { return ((x & y) ^ (x & z) ^ (y & z)); }
    function Sigma0256(x) { return (S(x, 2) ^ S(x, 13) ^ S(x, 22)); }
    function Sigma1256(x) { return (S(x, 6) ^ S(x, 11) ^ S(x, 25)); }
    function Gamma0256(x) { return (S(x, 7) ^ S(x, 18) ^ R(x, 3)); }
    function Gamma1256(x) { return (S(x, 17) ^ S(x, 19) ^ R(x, 10)); }
    function core_sha256 (m, l) {
        var K = new Array(0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5, 0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5, 0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3, 0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174, 0xE49B69C1, 0xEFBE4786, 0xFC19DC6, 0x240CA1CC, 0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA, 0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7, 0xC6E00BF3, 0xD5A79147, 0x6CA6351, 0x14292967, 0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13, 0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85, 0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3, 0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070, 0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5, 0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3, 0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208, 0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2);
        var HASH = new Array(0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19);
        var W = new Array(64);
        var a, b, c, d, e, f, g, h, i, j;
        var T1, T2;
        m[l >> 5] |= 0x80 << (24 - l % 32);
        m[((l + 64 >> 9) << 4) + 15] = l;
        for ( var i = 0; i<m.length; i+=16 ) {
            a = HASH[0];
            b = HASH[1];
            c = HASH[2];
            d = HASH[3];
            e = HASH[4];
            f = HASH[5];
            g = HASH[6];
            h = HASH[7];
            for ( var j = 0; j<64; j++) {
                if (j < 16) W[j] = m[j + i];
                else W[j] = safe_add(safe_add(safe_add(Gamma1256(W[j - 2]), W[j - 7]), Gamma0256(W[j - 15])), W[j - 16]);
                T1 = safe_add(safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]), W[j]);
                T2 = safe_add(Sigma0256(a), Maj(a, b, c));
                h = g;
                g = f;
                f = e;
                e = safe_add(d, T1);
                d = c;
                c = b;
                b = a;
                a = safe_add(T1, T2);
            }
            HASH[0] = safe_add(a, HASH[0]);
            HASH[1] = safe_add(b, HASH[1]);
            HASH[2] = safe_add(c, HASH[2]);
            HASH[3] = safe_add(d, HASH[3]);
            HASH[4] = safe_add(e, HASH[4]);
            HASH[5] = safe_add(f, HASH[5]);
            HASH[6] = safe_add(g, HASH[6]);
            HASH[7] = safe_add(h, HASH[7]);
        }
        return HASH;
    }
    function str2binb (str) {
        var bin = Array();
        var mask = (1 << chrsz) - 1;
        for(var i = 0; i < str.length * chrsz; i += chrsz) {
            bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - i%32);
        }
        return bin;
    }
    function Utf8Encode(string) {
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }
        return utftext;
    }
    function binb2hex (binarray) {
        var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
        var str = "";
        for(var i = 0; i < binarray.length * 4; i++) {
            str += hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8+4)) & 0xF) +
            hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8  )) & 0xF);
        }
        return str;
    }
    s = Utf8Encode(s);
    return binb2hex(core_sha256(str2binb(s), s.length * chrsz));
}

/* Constants */
var MININGDIFFICUTLY = 2;   // Warning: CPU performance will be decreased if the difficulty is larger than 4
var MININGREWARD = 10;

/* Helper functions */
var NONE = 0, ESSENTIAL = 1, ERROR = 2, DEBUG = 3, INFO = 4;
var logLevel = ERROR;

function print(level, log)
{
    if (level <= logLevel)
    {
        console.log(log);
    }
}

/* Main Data Structure */
class Transaction
{
    constructor(from, to, value)
    {
        this.from = from;
        this.to = to;
        this.value = value;
    }

    toString()
    {
        return "From: " + this.from + " to " + this.to + ", value: " + this.value;
    }
}

class Block
{
    constructor(timestamp, transaction, previousHash)
    {
        this.timestamp = timestamp;
        this.transaction = transaction;
        this.previousHash = previousHash;
        this.hash = this.calHash();
        this.nonce = 0;
    }

    calHash()
    {
        return SHA256(this.timestamp + this.transaction + this.previousHash + this.nonce);
    }

    toString()
    {
        return "Timestamp: " + this.timestamp + ", From: " + this.transaction.from + " to " + this.transaction.to + ", value: " + this.transaction.value;
    }

    proofOfWork(difficulty)
    {
        while(this.hash.substring(0, difficulty) != Array(difficulty + 1).join("0"))
        {
            this.nonce += 1;
            this.hash = this.calHash();
        }
    }
}

class Blockchain
{
    constructor()
    {
        this.head = [new Block("1/1/1970", new Transaction("", "", ""), "")];
        this.miningDifficulty = MININGDIFFICUTLY;
        this.miningReward = MININGREWARD;
    }

    pushBlock(block, account)
    {
        if (block.hash.substring(0, this.miningDifficulty) != Array(this.miningDifficulty + 1).join("0"))
        {
            print(ERROR, "Proof of work failed!");
        }
        this.head.push(new Block(block.timestamp, block.transaction, this.head[this.head.length - 1].hash));
        // Mining reward
        this.head.push(new Block(block.timestamp, new Transaction("MASTER_BLOCKCHAIN", account.name, this.miningReward), this.head[this.head.length - 1].hash));
    }

    printAll()
    {
        for (var i = 1; i < this.head.length; i++)
        {
            print(DEBUG, "previousHash: " + this.head[i].previousHash);
            print(ESSENTIAL, this.head[i].toString());
            print(DEBUG, "thisHash: " + this.head[i].hash);
            print(DEBUG, "");
        }
    }

    checkValidity()
    {
        for (var i = 1; i < this.head.length - 1; i++)
        {
            if (this.head[i].hash != this.head[i + 1].previousHash)
            {
                print(ERROR, "Blockchain is invalid");
            }
        }
        print(INFO, "Blockchain is valid");
    }

    getBalance(name)
    {
        print(INFO, "Get account balance for " + name);
        var balance = 0;
        for (var i = 1; i < this.head.length; i++)
        {
            if (this.head[i].transaction.to == name)
            {
                print(DEBUG, "+ " + this.head[i].transaction.value);
                balance += this.head[i].transaction.value;
            }
            else if (this.head[i].transaction.from == name)
            {
                print(DEBUG, "- " + this.head[i].transaction.value);
                balance -= this.head[i].transaction.value;
            }
        }
        print(ESSENTIAL, name + ": " + balance);
        return balance;
    }
}

class PendingTransactions
{
    constructor()
    {
        this.head = [];
    }

    pushTransaction(transaction)
    {
        this.head.push(transaction);
    }

    popTransaction()
    {
        return this.head.shift();
    }

    printAll()
    {
        for (var i = 0; i < this.head.length; i++)
        {
            print(ESSENTIAL, this.head[i].toString());
        }
    }
}

class Account
{
    constructor(name, id)
    {
        this.name = name;
        this.id = id;
    }

    mineBlock()
    {
        var block = new Block(new Date().toLocaleString(), masterPendingTransactions.popTransaction());
        block.proofOfWork(masterBlockChain.miningDifficulty);
        masterBlockChain.pushBlock(block, this);
    }

    transfer(account, value)
    {
        print(INFO, "Transfer " + value + " from " + this.name + " to " + account.name);
        masterPendingTransactions.pushTransaction(new Transaction(this.name, account.name, value));
    }
}

/* Static global variables */
var masterBlockChain = new Blockchain();
var masterPendingTransactions = new PendingTransactions();

var alice = new Account("Alice", 1);
var bob = new Account("Bob", 2);
var carol = new Account("Carol", 3);
