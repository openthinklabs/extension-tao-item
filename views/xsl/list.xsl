<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns="http://www.w3.org/1999/xhtml">

  <xsl:output method="xml" version="1.0" encoding="utf-8" indent="yes" omit-xml-declaration="yes" />

  <!-- list -->
  <xsl:template match="item" mode="list">
    <xsl:apply-templates select="responses" mode="list" />
  </xsl:template>

  <!-- responses -->
  <xsl:template match="responses" mode="list">
    <table class="list_table">
      <tbody>
        <xsl:apply-templates select="response" mode="list" />
        <xsl:variable name='footer'>
          <xsl:value-of select="footer" />
        </xsl:variable>
        <xsl:if test='$footer!=""'>
          <xsl:apply-templates select="footer" mode="list" />
        </xsl:if>
      </tbody>
    </table>
  </xsl:template>

  <!-- response -->
  <xsl:template match="response" mode="list">
    <tr>
      <xsl:call-template name="table_tr_even_odd">
        <xsl:with-param name="position" select="position()" />
      </xsl:call-template>
      <xsl:choose>
        <xsl:when test="input">
          <td>
            <xsl:call-template name="table_tr_td">
              <xsl:with-param name="count" select="count(.)" />
            </xsl:call-template>
            <!--@todo managing by tag now-->
            <xsl:value-of disable-output-escaping="yes" select="substring-before(., '[FTE]')" />
            <xsl:apply-templates select="description" mode="list">
              <xsl:with-param name="responsePos">
                <xsl:value-of select="count(preceding-sibling::*)+2" />
              </xsl:with-param>
            </xsl:apply-templates>
          </td>
          <td>
            <xsl:apply-templates select="." mode="form" />
          </td>
          <td class="td_after_fte">
            <xsl:call-template name="table_tr_td">
              <xsl:with-param name="count" select="count(.)" />
            </xsl:call-template>
            <!--@todo managing by tag now-->
            <xsl:value-of disable-output-escaping="yes" select="substring-after(., '[FTE]')" />
          </td>
        </xsl:when>
        <xsl:otherwise>
          <td>
            <xsl:call-template name="table_tr_td">
              <xsl:with-param name="count" select="count(.)" />
            </xsl:call-template>
            <xsl:value-of disable-output-escaping="yes" select="label" />
            <xsl:apply-templates select="description" mode="list">
              <xsl:with-param name="responsePos">
                <xsl:value-of select="count(preceding-sibling::*)+2" />
              </xsl:with-param>
            </xsl:apply-templates>
          </td>
          <td>
            <xsl:apply-templates select="." mode="form" />
          </td>
          <td class="td_after_fte"></td>
        </xsl:otherwise>
      </xsl:choose>
    </tr>
  </xsl:template>

  <!-- response/description -->
  <xsl:template match="response/description" mode="list">
    <xsl:param name="responsePos" />
    <xsl:variable name="descriptionPos" select="count(preceding-sibling::*)+1" />
    <xsl:if test="$responsePos=$descriptionPos">
      <p>
        <xsl:call-template name="response_description" />
        <xsl:value-of disable-output-escaping="yes" select="." />
      </p>
    </xsl:if>
  </xsl:template>

  <!-- footer -->
  <xsl:template match="responses/footer" mode="list">
    <xsl:apply-templates select="." mode="generic">
      <xsl:with-param name="column" select="2" />
    </xsl:apply-templates>
  </xsl:template>
</xsl:stylesheet>