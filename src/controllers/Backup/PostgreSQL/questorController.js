const { Pool } = require('pg');

// Configuração da conexão PostgreSQL
const pool = new Pool({
  host: process.env.HOST,
  port: Number(process.env.PORT || process.env.PORT2) || 5432,
  database: process.env.DATABASE,
  user: process.env.USER,
  password: process.env.PASSWORD,
  // ssl: { rejectUnauthorized: false }, // habilite se seu provedor exigir
});

// Escapa identificadores (schema/tabela) com aspas duplas corretas
function quoteIdent(ident) {
  return '"' + String(ident).replace(/"/g, '""') + '"';
}

// Controller que busca Contatos
const getContatos = async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 0;
  const tabela = req.query.tabela || 'null';

  try {
    let query = '';
    const params = [];

    // Modo padrão: join entre tabelas de negócio
    if (tabela === 'null') {
      query = `
        SELECT
          trib.codigoempresa,
          contato.razao_social,
          trib.caracteristica,
          contato.email_geral,
          contato.email_fiscal,
          contato.email_contabil,
          contato.email_dp,
          contato.email_societario,
          contato.email_dp_crt_experiencia,
          contato.email_financeiro
        FROM pex_tributacao_empresas AS trib
        INNER JOIN pex_cadastroestab_contato AS contato
          ON trib.codigoempresa = contato.cod_questor
      `;
      if (limit > 0) {
        params.push(limit);
        query += ` LIMIT $${params.length}`;
      }
    }
    // Listar todas as tabelas de usuário
    else if (tabela === 'all') {
      query = `
        SELECT tablename AS nome_das_tabelas
        FROM pg_catalog.pg_tables
        WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
        ORDER BY tablename
      `;
      if (limit > 0) {
        params.push(limit);
        query += ` LIMIT $${params.length}`;
      }
    }
    // Select * from <tabela> com validação
    else {
      // permite opcionalmente schema.tabela; apenas letras, números e _
      if (!/^[a-zA-Z0-9_]+(\.[a-zA-Z0-9_]+)?$/.test(tabela)) {
        return res.status(400).json({ error: 'Nome de tabela inválido.' });
      }
      const parts = tabela.split('.');
      const tableSQL =
        parts.length === 2
          ? `${quoteIdent(parts[0])}.${quoteIdent(parts[1])}`
          : quoteIdent(parts[0]);

      query = `SELECT * FROM ${tableSQL}`;
      if (limit > 0) {
        params.push(limit);
        query += ` LIMIT $${params.length}`;
      }
    }

    const { rows } = await pool.query(query.trim(), params);
    return res.status(200).json(rows);
  } catch (err) {
    console.error('Erro ao executar consulta', err);
    return res.status(500).json({ error: 'Erro ao executar a consulta SQL.' });
  }
};


/* 
//Lista os nomes da coluna de uma Tabela
const getConsultaDados = (req, res) => {
    Firebird.attach(options, function (err, db) {
        const limit = parseInt(req.query.limit) || 0;
        const consulta = req.query.consulta || 'null'
        let getTable;
        if (err) {
            console.error('Erro ao conectar', err);
            return res.status(500).json({ error: 'Erro ao conectar ao banco de dados' });
        }

        if (limit > 0) {
            getLimitsText = ` FIRST ${limit} `
        } else {
            getLimitsText = "";
        }

        //Modo Padrão
        if (consulta !== 'null') {

            getTable = `
            SELECT TRIM(RF.RDB$FIELD_NAME) AS COLUNA
                FROM RDB$RELATION_FIELDS RF
                WHERE RF.RDB$RELATION_NAME = '${consulta.toUpperCase()}'
                ORDER BY RF.RDB$FIELD_POSITION;`;
        } else {
            getTable = `SELECT ${getLimitsText} TRIM(RDB$RELATION_NAME) AS NOME_DAS_TABELAS
                            FROM RDB$RELATIONS
                            WHERE RDB$SYSTEM_FLAG = 0
                            AND RDB$VIEW_BLR IS NULL
                            ORDER BY RDB$RELATION_NAME;`
        }

        db.query(getTable, (err, result) => {
            db.detach(); //Libera a conexão com o banco de dados

            if (err) {
                console.error('Erro na consulta', err);
                return res.status(500).json({ error: 'Erro ao executar a consulta SQL.' });
            }
            res.status(200).json(result);
        });
    });
};

const getPesquisaTabelaColuns = async (req, res) => {
    Firebird.attach(options, async function (err, db) {
        const table = req.query.table || 'null';
        const coluns = req.query.coluns || 'null';
        const consulta = req.query.consulta || 'null';

        let getTable;
        let getColuns;
        let getQuery;

        if (err) {
            console.error('Erro ao conectar', err);
            return res.status(500).json({ error: 'Erro ao conectar ao banco de dados' });
        }

        if (coluns !== 'null') {
            getColuns = coluns.split(';')
            getQuery = ''

            getColuns.forEach((result, index) => {
                getQuery += `${result} LIKE '%${consulta}%'`

                if (index !== getColuns.length - 1) {
                    getQuery += ' OR '
                }
            })
        }

        getTable = `SELECT * FROM ${table} WHERE ${getQuery}`

        await db.query(getTable, (err, result) => {
            db.detach(); //Libera a conexão com o banco de dados

            if (err) {
                console.error('Erro na consulta', err);
                res.status(500).json({ error: 'Erro ao executar a consulta SQL.' });
            }
            res.status(200).json(result);
        })
    })
} */


module.exports = {
    getContatos
};