xml.instruct! :xml, :version=>"1.0", :encoding=>"UTF-8"
xml.Workbook({
        'xmlns'      => "urn:schemas-microsoft-com:office:spreadsheet",
        'xmlns:o'    => "urn:schemas-microsoft-com:office:office",
        'xmlns:x'    => "urn:schemas-microsoft-com:office:excel",
        'xmlns:html' => "http://www.w3.org/TR/REC-html40",
        'xmlns:ss'   => "urn:schemas-microsoft-com:office:spreadsheet"
}) do


    xml.Styles do
      xml.Style 'ss:ID' => 'Default', 'ss:Name' => 'Normal' do
        xml.Alignment 'ss:Vertical' => 'Bottom'
        xml.Borders
        xml.Font 'ss:FontName' => 'Verdana'
        xml.Interior
        xml.NumberFormat
        xml.Protection
      end

      xml.Style 'ss:ID'=>"s25" do
        xml.Alignment 'ss:Horizontal'=>"Center", 'ss:Vertical'=>"Bottom"
        xml.Font 'ss:FontName'=>"Verdana", 'ss:Bold'=>"1"
      end
    end

  for section in @retro.sections

    xml.Worksheet 'ss:Name' => section.name[0..29] do
      xml.Table 'ss:DefaultColumnWidth'=>'100','ss:DefaultRowHeight' => '15' do

        xml.Row do
          xml.Cell 'ss:StyleID'=>"s25", "ss:MergeAcross"=>"1" do
            xml.Data section.name, 'ss:Type' => 'String'
          end
        end

        xml.Row do
          xml.Cell { xml.Data 'Point', 'ss:Type' => 'String' }
          xml.Cell { xml.Data 'Votes', 'ss:Type' => 'String' }
          xml.Cell { xml.Data 'Up Votes', 'ss:Type' => 'String' }
          xml.Cell { xml.Data 'Down Votes', 'ss:Type' => 'String' }
        end

        # Rows
        for point in section.points.sort{|a,b| b.votes.length <=> a.votes.length}
          xml.Row do
            xml.Cell { xml.Data CGI.unescapeHTML(point.message), 'ss:Type' => 'String' }
            xml.Cell { xml.Data point.votes.length, 'ss:Type' => 'Number' }
            xml.Cell { xml.Data point.up_votes.length, 'ss:Type' => 'Number' }
            xml.Cell { xml.Data point.down_votes.length, 'ss:Type' => 'Number' }
          end
        end

      end
    end
  end
end
