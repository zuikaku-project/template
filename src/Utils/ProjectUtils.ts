import { load } from "js-yaml";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { deserialize, serialize } from "node:v8";

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class ProjectUtils {
    public static async import<T>(
        path: string,
        ...args: any[]
    ): Promise<T | undefined> {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const file = await import(resolve(path)).then(m => m.default);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        return file ? new file(...args) : undefined;
    }

    public static readdirRecursive(directory: string): string[] {
        const results: string[] = [];
        function read(path: string): void {
            const files = readdirSync(path);
            for (const file of files) {
                const dir = join(path, file);
                if (statSync(dir).isDirectory()) {
                    read(dir);
                } else {
                    results.push(dir);
                }
                // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
                delete require.cache[dir];
            }
        }
        read(directory);
        return results;
    }

    public static structuredClone<T>(obj: T): T {
        return deserialize(serialize(obj)) as T;
    }

    public static parseYaml<T>(src: string): T {
        return load(readFileSync(join(src), "utf8")) as T;
    }
}
