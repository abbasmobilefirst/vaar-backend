const { Document } = require("../../Models/User/Documents");

exports.AddDocument = async (req, res) => {
  try {
    const { pdfFile } = req.body;

    const document = await Document.create({
      documentTitle: pdfFile.name,
      url: pdfFile.url,
      documentType: "pdf",
      uploadedBy: req.id,
      size: pdfFile.size,
    });
    return res.status(200).json({
      isSuccess: true,
      document,
      message: "Document Added Successfully",
    });
  } catch (err) {
    res.status(500).json({
      isSuccess: false,
      message: "Internal Server Error",
    });
  }
};
