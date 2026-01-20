// 환경 변수 로드 (개발 환경에서만)
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'bongtube_secret_key_2025';

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 프로덕션 환경에서 클라이언트 빌드 파일 제공
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// 데이터 저장 경로
const DATA_DIR = path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const APPLICATIONS_FILE = path.join(DATA_DIR, 'applications.json');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');

// 데이터 디렉토리 생성
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// 데이터 파일 초기화
const initDataFiles = () => {
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2));
  }
  if (!fs.existsSync(APPLICATIONS_FILE)) {
    fs.writeFileSync(APPLICATIONS_FILE, JSON.stringify([], null, 2));
  }
  if (!fs.existsSync(PRODUCTS_FILE)) {
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify([
      { id: 1, name: '3개월', price: 25000, duration: 3 }
    ], null, 2));
  }
};

initDataFiles();

// 관리자 계정 초기화
const initAdmin = async () => {
  const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
  const adminExists = users.find(u => u.username === 'bongtubeadmin');
  
  if (!adminExists) {
    const hashedPassword = await bcrypt.hash('bongadmin1234', 10);
    users.push({
      id: Date.now(),
      username: 'bongtubeadmin',
      password: hashedPassword,
      name: '관리자',
      phone: '',
      isAdmin: true,
      createdAt: new Date().toISOString()
    });
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  }
};

initAdmin();

// 인증 미들웨어
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: '인증 토큰이 필요합니다.' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: '유효하지 않은 토큰입니다.' });
    }
    req.user = user;
    next();
  });
};

// 관리자 권한 확인
const isAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ error: '관리자 권한이 필요합니다.' });
  }
  next();
};

// 회원가입
app.post('/api/register', async (req, res) => {
  try {
    const { username, password, name, phone } = req.body;

    if (!username || !password || !name || !phone) {
      return res.status(400).json({ error: '모든 필드를 입력해주세요.' });
    }

    const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
    
    if (users.find(u => u.username === username)) {
      return res.status(400).json({ error: '이미 존재하는 아이디입니다.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: Date.now(),
      username,
      password: hashedPassword,
      name,
      phone,
      isAdmin: false,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

    const token = jwt.sign(
      { id: newUser.id, username: newUser.username, isAdmin: false },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, user: { id: newUser.id, username: newUser.username, name: newUser.name, isAdmin: false } });
  } catch (error) {
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// 로그인
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: '아이디와 비밀번호를 입력해주세요.' });
    }

    const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
    const user = users.find(u => u.username === username);

    if (!user) {
      return res.status(401).json({ error: '아이디 또는 비밀번호가 잘못되었습니다.' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: '아이디 또는 비밀번호가 잘못되었습니다.' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, isAdmin: user.isAdmin },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// 신청서 제출 (비회원)
app.post('/api/application', (req, res) => {
  try {
    const { phone, plan, email, password, backupCodes } = req.body;

    if (!phone || !plan || !email || !password || !backupCodes || backupCodes.length !== 3) {
      return res.status(400).json({ error: '모든 필드를 입력해주세요.' });
    }

    // 백업코드 검증
    const validCodes = backupCodes.every(code => /^\d{8}$/.test(code));
    if (!validCodes) {
      return res.status(400).json({ error: '백업코드는 모두 8자리 숫자여야 합니다.' });
    }

    const applications = JSON.parse(fs.readFileSync(APPLICATIONS_FILE, 'utf8'));
    const newApplication = {
      id: Date.now(),
      phone,
      plan,
      email,
      password,
      backupCodes,
      ordererName: '',
      memo: '',
      status: 'pending',
      createdAt: new Date().toISOString(),
      userId: null
    };

    applications.push(newApplication);
    fs.writeFileSync(APPLICATIONS_FILE, JSON.stringify(applications, null, 2));

    res.json({ message: '신청이 완료되었습니다.', id: newApplication.id });
  } catch (error) {
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// 회원 신청서 제출
app.post('/api/application/member', authenticateToken, (req, res) => {
  try {
    const { plan, email, password, backupCodes } = req.body;

    if (!plan || !email || !password || !backupCodes || backupCodes.length !== 3) {
      return res.status(400).json({ error: '모든 필드를 입력해주세요.' });
    }

    const validCodes = backupCodes.every(code => /^\d{8}$/.test(code));
    if (!validCodes) {
      return res.status(400).json({ error: '백업코드는 모두 8자리 숫자여야 합니다.' });
    }

    const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
    const user = users.find(u => u.id === req.user.id);

    const applications = JSON.parse(fs.readFileSync(APPLICATIONS_FILE, 'utf8'));
    const newApplication = {
      id: Date.now(),
      phone: user.phone,
      plan,
      email,
      password,
      backupCodes,
      ordererName: user.name || '',
      memo: '',
      status: 'pending',
      createdAt: new Date().toISOString(),
      userId: req.user.id
    };

    applications.push(newApplication);
    fs.writeFileSync(APPLICATIONS_FILE, JSON.stringify(applications, null, 2));

    res.json({ message: '신청이 완료되었습니다.', id: newApplication.id });
  } catch (error) {
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// 관리자 - 회원 목록
app.get('/api/admin/users', authenticateToken, isAdmin, (req, res) => {
  try {
    const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
    const usersWithoutPassword = users.map(({ password, ...user }) => user);
    res.json(usersWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// 관리자 - 신청서 목록
app.get('/api/admin/applications', authenticateToken, isAdmin, (req, res) => {
  try {
    const applications = JSON.parse(fs.readFileSync(APPLICATIONS_FILE, 'utf8'));
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// 관리자 - 상품 목록
app.get('/api/admin/products', authenticateToken, isAdmin, (req, res) => {
  try {
    const products = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf8'));
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// 관리자 - 상품 추가
app.post('/api/admin/products', authenticateToken, isAdmin, (req, res) => {
  try {
    const { name, price, duration } = req.body;
    const products = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf8'));
    const newProduct = {
      id: Date.now(),
      name,
      price,
      duration
    };
    products.push(newProduct);
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
    res.json(newProduct);
  } catch (error) {
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// 관리자 - 상품 삭제
app.delete('/api/admin/products/:id', authenticateToken, isAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const products = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf8'));
    const filtered = products.filter(p => p.id !== parseInt(id));
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(filtered, null, 2));
    res.json({ message: '상품이 삭제되었습니다.' });
  } catch (error) {
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// 관리자 - 신청서 상태 변경
app.put('/api/admin/applications/:id', authenticateToken, isAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const {
      status,
      failureReason,
      ordererName,
      plan,
      phone,
      email,
      password,
      backupCodes,
      memo
    } = req.body;
    const applications = JSON.parse(fs.readFileSync(APPLICATIONS_FILE, 'utf8'));
    const index = applications.findIndex(a => a.id === parseInt(id));
    if (index !== -1) {
      if (status) {
        applications[index].status = status;
      }
      if (failureReason) {
        applications[index].failureReason = failureReason;
      }
      if (ordererName !== undefined) {
        applications[index].ordererName = ordererName;
      }
      if (plan !== undefined) {
        applications[index].plan = plan;
      }
      if (phone !== undefined) {
        applications[index].phone = phone;
      }
      if (email !== undefined) {
        applications[index].email = email;
      }
      if (password !== undefined) {
        applications[index].password = password;
      }
      if (backupCodes !== undefined) {
        applications[index].backupCodes = Array.isArray(backupCodes) ? backupCodes : [];
      }
      if (memo !== undefined) {
        applications[index].memo = memo;
      }
      fs.writeFileSync(APPLICATIONS_FILE, JSON.stringify(applications, null, 2));
      res.json(applications[index]);
    } else {
      res.status(404).json({ error: '신청서를 찾을 수 없습니다.' });
    }
  } catch (error) {
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// 공개 상품 목록
app.get('/api/products', (req, res) => {
  try {
    const products = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf8'));
    // 배열인지 확인
    if (Array.isArray(products)) {
      res.json(products);
    } else {
      console.error('상품 데이터가 배열이 아닙니다:', products);
      res.json([]);
    }
  } catch (error) {
    console.error('상품 목록 읽기 오류:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// 프로덕션 환경에서 모든 라우트를 클라이언트로 리다이렉트
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  if (process.env.NODE_ENV === 'production') {
    console.log('Production mode: Serving static files from client/build');
  }
});
