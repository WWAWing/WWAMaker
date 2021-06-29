export default function getImagePath(filePath: string, imageFilename: string): string {
    const pathDelimiter = 
        (!filePath.includes("/") && filePath.includes("\\")) ? "\\"
        : "/";
    return filePath.substring(0, filePath.lastIndexOf(pathDelimiter)) + pathDelimiter + imageFilename;
}
