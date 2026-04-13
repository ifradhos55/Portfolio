import Cocoa
import PDFKit

let args = CommandLine.arguments
if args.count < 3 {
    print("Usage: extract_pdf <pdf-path> <output-dir>")
    exit(1)
}

let pdfPath = args[1]
let outDir = args[2]

let url = URL(fileURLWithPath: pdfPath)
guard let document = PDFDocument(url: url) else {
    print("Could not load pdf")
    exit(1)
}

for i in 0..<document.pageCount {
    guard let page = document.page(at: i) else { continue }
    let pageRect = page.bounds(for: .mediaBox)
    let img = page.thumbnail(of: pageRect.size, for: .mediaBox)
    
    let tiffData = img.tiffRepresentation!
    let bitmap = NSBitmapImageRep(data: tiffData)!
    let jpegData = bitmap.representation(using: .jpeg, properties: [.compressionFactor: 0.9])!
    
    let path = outDir + "/page_\(i).jpg"
    try! jpegData.write(to: URL(fileURLWithPath: path))
    print("Saved \(path)")
}
