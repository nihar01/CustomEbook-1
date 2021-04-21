package com.iiitb.customebook;

import com.iiitb.customebook.pojo.BookChapterVO;
import com.iiitb.customebook.pojo.BookVO;
import com.iiitb.customebook.util.CustomEBookConstants;
import org.apache.pdfbox.multipdf.PDFMergerUtility;
import org.apache.pdfbox.multipdf.Splitter;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Marshaller;
import javax.xml.bind.Unmarshaller;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@SpringBootApplication
public class CustomebookApplication {

    public static void main(String[] args) throws IOException {
        SpringApplication.run(CustomebookApplication.class, args);
        //readXML();
        //writeXML();
        //addToXML();
        splitPdf("sample2",21,30);
        mergePDF();
        makeDirectory(CustomEBookConstants.PATH_BOOKS);
        makeDirectory(CustomEBookConstants.PATH_BOOKS_XML);
    }

    private static void mergePDF() throws IOException {

        //Loading an existing PDF document
        File file1 = new File(CustomEBookConstants.PATH_BOOKS+"/sample.pdf");
        PDDocument document1 = PDDocument.load(file1);
        File file2 = new File(CustomEBookConstants.PATH_BOOKS+"/sample2.pdf");
        PDDocument document2 = PDDocument.load(file2);

        //Create PDFMergerUtility class object
        PDFMergerUtility PDFmerger = new PDFMergerUtility();

        //Setting the destination file path
        PDFmerger.setDestinationFileName(CustomEBookConstants.PATH_BOOKS+"/merged.pdf");

        //adding the source files
        PDFmerger.addSource(file1);
        PDFmerger.addSource(file2);
        //Merging the documents
        PDFmerger.mergeDocuments(null);

        System.out.println("PDF Documents merged to a single file successfully");

//Close documents
        document1.close();
        document2.close();

    }

    private static void makeDirectory(String path) {

        File f1 = new File(path);
        //Creating a folder using mkdir() method
        boolean bool = f1.mkdir();
        if(bool){
            System.out.println("Folder is created successfully");
        }else{
            System.out.println("Error Found!");
        }

    }

    private static void splitPdf(String fileName, int fromPage, int toPage) throws IOException {

        // Loading PDF
        File pdfFile
                = new File(CustomEBookConstants.PATH_BOOKS+"/DevOps For Dummies" + CustomEBookConstants.PDF_FILE_EXTENSION);
        PDDocument document = PDDocument.load(pdfFile);
        if (document.getNumberOfPages() > 20) {
            System.out.println(document.getDocumentInformation().getTitle());
            try {
                Splitter splitter = new Splitter();
                splitter.setStartPage(fromPage);
                splitter.setEndPage(toPage);
                splitter.setSplitAtPage(toPage);
                List<PDDocument> splittedList = splitter.split(document);
                for (PDDocument doc : splittedList) {
                    doc.save( CustomEBookConstants.PATH_BOOKS+"/"+fileName + ".pdf");
                    doc.close();
                }
                System.out.println("Save successful file : " + fileName);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

   /* public static void readXML() {
        System.out.println("Hello");

        try{
            File file = new File("src/main/resources/Books/IntroductionToAlgorithm.xml");
            JAXBContext jaxbContext = JAXBContext.newInstance(BookVO.class);

            Unmarshaller jaxbUnmarshaller = jaxbContext.createUnmarshaller();
            BookVO book= (BookVO) jaxbUnmarshaller.unmarshal(file);
            System.out.println("Chapters:");
            List<BookChapterVO> list=book.getBookChapters();
            for(BookChapterVO chapters:list)
                System.out.println(chapters.getChapterNumber()+" "+chapters.getChapterName()+"  "+chapters.getPrice() + " " + chapters.getContentLocation());

        } catch (JAXBException e) {
            e.printStackTrace();
        }
    }

    public static void writeXML() {
        System.out.println("Hello from the other side");

        try {
            JAXBContext contextObj = JAXBContext.newInstance(BookVO.class);

            Marshaller marshallerObj = contextObj.createMarshaller();
            marshallerObj.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, true);

            BookChapterVO chapter1 = new BookChapterVO(1, "Linkin Park", 5100.30, "I've become so numb\n" +
                    "I can't feel you there\n" +
                    "Become so tired\n" +
                    "So much more aware");
            BookChapterVO chapter2 = new BookChapterVO(2, "Green Day", 5200.20, "Summer has come and passed\n" +
                    "The innocent can never last\n" +
                    "Wake me up when September ends");

            ArrayList<BookChapterVO> list = new ArrayList<>();
            list.add(chapter1);
            list.add(chapter2);

            BookVO book = new BookVO();
            book.setBookchapters(list);
            marshallerObj.marshal(book, new FileOutputStream("src/main/resources/Books/newsample.xml"));
        } catch(JAXBException | FileNotFoundException e) {
            e.printStackTrace();
        }


    }

    public static void addToXML() {
        System.out.println("Hello! Again....");

        try{
            File file = new File("src/main/resources/Books/pythonBook.xml");
            JAXBContext jaxbContext = JAXBContext.newInstance(BookVO.class);

            Unmarshaller jaxbUnmarshaller = jaxbContext.createUnmarshaller();
            BookVO book= (BookVO) jaxbUnmarshaller.unmarshal(file);
            System.out.println("Existing Chapters:");
            List<BookChapterVO> chapterList=book.getBookChapters();
            for(BookChapterVO chapters:chapterList)
                System.out.println(chapters.getChapterNumber()+" "+chapters.getChapterName()+"  "+chapters.getPrice() + " " + chapters.getContentLocation());
            BookChapterVO newChapter = new BookChapterVO(3, "Twinkle", 500.30, "Twinkle Twinkle Little Star, How I wonder what you are?");
            chapterList.add(newChapter);
            book.setBookchapters(chapterList);

            Marshaller marshaller = jaxbContext.createMarshaller();
            marshaller.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, Boolean.TRUE);
            marshaller.marshal(book, file);
        } catch (JAXBException e) {
            e.printStackTrace();
        }
    }*/

}
