

// 1. Write a function that logs the current file path and directory.
function logCurrentPaths() {
    console.log({ File: __filename, Dir: __dirname });
}

// 2. Write a function that takes a file path and returns its file name.
function getFileName(filePath) {
    return path.basename(filePath);
}

// 3. Write a function that builds a path from an object
function buildPath(pathObj) {
    return path.format(pathObj);
}

// 4. Write a function that returns the file extension from a given file path.
function getExtension(filePath) {
    return path.extname(filePath);
}

// 5. Write a function that parses a given path and returns its name and ext.
function parsePath(filePath) {
    const parsed = path.parse(filePath);
    return { Name: parsed.name, Ext: parsed.ext };
}

// 6. Write a function that checks whether a given path is absolute.
function checkIsAbsolute(filePath) {
    return path.isAbsolute(filePath);
}

// 7. Write a function that joins multiple segments
function joinSegments(...segments) {
    return path.join(...segments);
}

// 8. Write a function that resolves a relative path to an absolute one.
function resolveToAbsolute(relativePath) {
    return path.resolve(relativePath);
}

// 9. Write a function that joins two paths.
function joinTwoPaths(path1, path2) {
    return path.join(path1, path2);
}

// 10. Write a function that deletes a file asynchronously.
function deleteFileAsync(filePath) {
    fs.unlink(filePath, (err) => {
        if (err) console.error(err);
        else console.log(`The ${path.basename(filePath)} is deleted.`);
    });
}

// 11. Write a function that creates a folder synchronously.
function createFolderSync(dirPath) {
    try {
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath);
        }
        return "Success";
    } catch (err) {
        return err.message;
    }
}

// 12. Create an event emitter that listens for a "start" event and logs a welcome message.
const eventEmitter = new EventEmitter();
eventEmitter.on('start', () => {
    console.log("Welcome event triggered!");
});
// eventEmitter.emit('start'); // للتجربة

// 13. Emit a custom "login" event with a username parameter.
eventEmitter.on('login', (username) => {
    console.log(`User logged in: ${username}`);
});
function triggerLogin(username) {
    eventEmitter.emit('login', username);
}

// 14. Read a file synchronously and log its contents.
function readFileSyncLogged(filePath) {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        console.log(`the file content => "${data}"`);
    } catch (err) {
        console.error(err.message);
    }
}

// 15. Write asynchronously to a file.
function writeAsyncFile(filePath, content) {
    fs.writeFile(filePath, content, (err) => {
        if (err) console.error(err);
        else console.log("File saved asynchronously");
    });
}

// 16. Check if a directory exists.
function checkDirectoryExists(dirPath) {
    return fs.existsSync(dirPath);
}

// 17. Write a function that returns the OS platform and CPU architecture.
function getSystemInfo() {
    return { Platform: os.platform(), Arch: os.arch() };
}

// 18. Use a readable stream to read a file in chunks and log each chunk.
function readFileInChunks(filePath) {
    const readableStream = fs.createReadStream(filePath, { encoding: 'utf8' });
    readableStream.on('data', (chunk) => {
        console.log("Chunk:", chunk);
    });
}

// 19. Use readable and writable streams to copy content from one file to another.
function copyFileUsingStreams(source, dest) {
    const reader = fs.createReadStream(source);
    const writer = fs.createWriteStream(dest);
    reader.pipe(writer);
    writer.on('finish', () => {
        console.log("File copied using streams");
    });
}

// 20. Create a pipeline that reads a file, compresses it, and writes it to another file.
function compressFile(source, dest) {
    const gzip = zlib.createGzip();
    const sourceStream = fs.createReadStream(source);
    const destinationStream = fs.createWriteStream(dest);

    pipeline(sourceStream, gzip, destinationStream, (err) => {
        if (err) console.error('Pipeline failed:', err);
        else console.log('Pipeline succeeded.');
    });
}



//part 2

const http = require("http");
const fs = require("fs");

const FILE = "./users.json";

function readUsers() {
    if (!fs.existsSync(FILE)) {
        fs.writeFileSync(FILE, "[]");
    }
    return JSON.parse(fs.readFileSync(FILE, "utf8"));
}

function writeUsers(users) {
    fs.writeFileSync(FILE, JSON.stringify(users, null, 2));
}

const server = http.createServer((req, res) => {

    res.setHeader("Content-Type", "application/json");

    // GET ALL USERS
    if (req.method === "GET" && req.url === "/user") {
        return res.end(JSON.stringify(readUsers()));
    }

    // GET USER BY ID
    if (req.method === "GET" && req.url.startsWith("/user/")) {
        const id = Number(req.url.split("/")[2]);

        const users = readUsers();
        const user = users.find(u => u.id === id);

        if (!user) {
            res.statusCode = 404;
            return res.end(JSON.stringify({ message: "User not found" }));
        }

        return res.end(JSON.stringify(user));
    }

    // POST USER
    if (req.method === "POST" && req.url === "/user") {

        let body = "";

        req.on("data", chunk => body += chunk);

        req.on("end", () => {

            const users = readUsers();
            const newUser = JSON.parse(body);

            const exist = users.find(u => u.email === newUser.email);

            if (exist) {
                res.statusCode = 400;
                return res.end(JSON.stringify({ message: "Email already exists" }));
            }

            newUser.id = Date.now();

            users.push(newUser);

            writeUsers(users);

            res.statusCode = 201;
            res.end(JSON.stringify({ message: "User added successfully" }));

        });
    }
